import React, { useState } from 'react'

// material ui
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
// import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
// import ListItemText from '@material-ui/core/ListItemText'
// import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MaterialTextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

// sensenet
import { ODataCollectionResponse } from '@sensenet/client-core'
import { ChoiceFieldSetting, GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { MaterialIcon } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch, PresetField, ReferenceField, TextField } from '@sensenet/search-react'
import { useRepository } from '../hooks/use-repository'

const localStorageKey = 'sn-advanced-search-demo'

let demoData: { siteUrl: string; idOrPath: string | number; countOnly: boolean } = {
  siteUrl: '',
  idOrPath: '/Root',
  countOnly: false,
}
try {
  const storedValue = localStorage.getItem(localStorageKey)
  if (storedValue) {
    demoData = {
      ...demoData,
      ...JSON.parse(storedValue),
    }
  }
} catch (error) {
  console.warn('Failed to parse stored settings')
}

interface ExampleComponentState {
  loginnameFieldQuery: string
  emailFieldQuery: string
  fullnameFieldQuery: string
  jobtitleFieldQuery: string
  managerFieldQuery: string
  departmentFieldQuery: string
  languagesFieldQuery: string
  genderFieldQuery: string
  maritalstatusFieldQuery: string
  phoneFieldQuery: string
  fullQuery: string
  isSettingsOpen: boolean
  isHelpOpen: boolean
  response?: ODataCollectionResponse<User>
}

// const icons: any = {
//   user: 'person',
// }

/**
 * User search
 */
const UserSearchPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object

  /**
   * State object for the Example component
   */
  const [searchdata, setSearchdata] = useState<ExampleComponentState>({
    loginnameFieldQuery: '',
    emailFieldQuery: '',
    fullnameFieldQuery: '',
    jobtitleFieldQuery: '',
    managerFieldQuery: '',
    departmentFieldQuery: '',
    languagesFieldQuery: '',
    genderFieldQuery: '',
    maritalstatusFieldQuery: '',
    phoneFieldQuery: '',
    fullQuery: 'TypeIs:User',
    isSettingsOpen: localStorage.getItem(localStorageKey) === null, // false,
    isHelpOpen: false,
  })

  const sendRequest = async () => {
    const result = await repo.loadCollection<User>({
      path: `/Root/IMS`,
      oDataOptions: {
        metadata: 'no',
        inlinecount: 'allpages',
        query: searchdata.fullQuery,
        select: ['Avatar', 'Email', 'Fullname', 'LoginName'] as any,
        orderby: ['FullName', ['CreationDate', 'desc']],
      },
    })

    setSearchdata(prevState => ({ ...prevState, response: result }))
  }

  // get language options
  const fieldSettings = repo.schemas.getSchemaByName('User').FieldSettings
  const langSetting = fieldSettings.find(f => f.Name === 'Language') as ChoiceFieldSetting
  const genderSetting = fieldSettings.find(f => f.Name === 'Gender') as ChoiceFieldSetting
  const maritalSetting = fieldSettings.find(f => f.Name === 'MaritalStatus') as ChoiceFieldSetting
  const languages =
    langSetting !== undefined && langSetting.Options !== undefined
      ? langSetting.Options.map(l => ({
          text: l.Text ? l.Text : '',
          value: new Query(a => a.term(`Language:${l.Text}`)),
        }))
      : [{ text: 'English', value: new Query(a => a.term(`Language:en`)) }]

  const genders =
    genderSetting !== undefined && genderSetting.Options !== undefined
      ? genderSetting.Options.map(l => ({
          text: l.Text ? l.Text : '',
          value: l.Value === '...' ? new Query(a => a) : new Query(a => a.term(`Gender:${l.Value}`)),
        }))
      : [{ text: '', value: new Query(a => a.term(`Gender:Female`)) }]

  const maritals =
    maritalSetting !== undefined && maritalSetting.Options !== undefined
      ? maritalSetting.Options.map(l => ({
          text: l.Text ? l.Text : '',
          value: l.Value === '...' ? new Query(a => a) : new Query(a => a.term(`MaritalStatus:${l.Value}`)),
        }))
      : [{ text: '', value: new Query(a => a.term(`MaritalStatus:`)) }]
  /**
   * Renders the component
   */
  return (
    <div style={{ height: '100%' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <MaterialIcon
                iconName="search"
                style={{ color: 'white', padding: '0 15px 0 0', verticalAlign: 'text-bottom' }}
              />
              Search Component Demo
            </div>
            <div>
              <IconButton onClick={() => setSearchdata(prevState => ({ ...prevState, isHelpOpen: true }))} title="Help">
                <MaterialIcon iconName="help" style={{ color: 'white', verticalAlign: 'text-bottom' }} />
              </IconButton>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          height: 'calc(100% - 80px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <AdvancedSearch
          style={{ flexShrink: 0 }}
          onQueryChanged={q => {
            setSearchdata(prevState => ({ ...prevState, fullQuery: q.toString() }))
          }}
          schema={repo.schemas.getSchemaByName('User')}
          fields={_options => (
            <Paper style={{ margin: '1em' }}>
              <Typography variant="h6" style={{ padding: '1em .7em' }}>
                Advanced search in fields
              </Typography>
              <form
                style={{
                  display: 'flex',
                  padding: '1em',
                  justifyContent: 'space-evenly',
                  flexWrap: 'wrap',
                }}
                onSubmit={() => sendRequest()}
                noValidate={true}
                autoComplete="off">
                <TextField
                  fieldName="LoginName"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, nameFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldKey=""
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'LoginName')}
                  helperText={
                    searchdata.loginnameFieldQuery
                      ? `Field Query: ${searchdata.loginnameFieldQuery}`
                      : 'A simple free text query on the loginname field'
                  }
                />

                <TextField
                  fieldName="Email"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'Email')}
                  helperText={
                    searchdata.emailFieldQuery
                      ? `Field Query: ${searchdata.emailFieldQuery}`
                      : 'Query on the email address'
                  }
                />

                <TextField
                  fieldName="FullName"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'FullName')}
                  helperText={
                    searchdata.fullnameFieldQuery
                      ? `Field Query: ${searchdata.fullnameFieldQuery}`
                      : 'Query on the FullName'
                  }
                />

                <TextField
                  fieldName="JobTitle"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'JobTitle')}
                  helperText={
                    searchdata.jobtitleFieldQuery
                      ? `Field Query: ${searchdata.jobtitleFieldQuery}`
                      : 'Query on the JobTitle'
                  }
                />

                <ReferenceField
                  fieldName="DisplayName"
                  fieldSetting={{
                    ...(_options.schema.FieldSettings.find(s => s.Name === 'Manager') as ReferenceFieldSetting),
                    AllowedTypes: ['User'],
                  }}
                  fetchItems={async (q: Query<GenericContent>) => {
                    const response = await repo.loadCollection<GenericContent>({
                      path: demoData.idOrPath as string, // ToDo: query by Id in client-core
                      oDataOptions: {
                        select: ['Id', 'Path', 'Name', 'DisplayName', 'Type'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        query: q.toString(),
                        top: 10,
                      },
                    })
                    return response.d.results
                  }}
                  onQueryChange={(key: any, query: any) => {
                    setSearchdata(prevState => ({ ...prevState, managerFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  helperText={searchdata.managerFieldQuery || 'Search a user manager'}
                />

                <TextField
                  fieldName="Department"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'Department')}
                  helperText={
                    searchdata.departmentFieldQuery
                      ? `Field Query: ${searchdata.departmentFieldQuery}`
                      : 'Query on the Department'
                  }
                />

                <FormControl>
                  <InputLabel htmlFor="type-filter">Language</InputLabel>
                  <PresetField
                    fieldName="Language"
                    presets={[{ text: '-', value: new Query(a => a) }, ...languages]}
                    onQueryChange={(key, query) => {
                      setSearchdata(prevState => ({ ...prevState, languagesFieldQuery: query.toString() }))
                      _options.updateQuery(key, query)
                    }}
                  />
                  <FormHelperText>
                    {searchdata.languagesFieldQuery.length ? searchdata.languagesFieldQuery : 'Filter by language'}
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <InputLabel htmlFor="type-filter">Gender</InputLabel>
                  <PresetField
                    fieldName="Gender"
                    presets={genders}
                    onQueryChange={(key, query) => {
                      setSearchdata(prevState => ({ ...prevState, genderFieldQuery: query.toString() }))
                      _options.updateQuery(key, query)
                    }}
                  />
                  <FormHelperText>
                    {searchdata.genderFieldQuery.length ? searchdata.genderFieldQuery : 'Filter by gender'}
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <InputLabel htmlFor="type-filter">Marital Status</InputLabel>
                  <PresetField
                    fieldName="MaritalStatus"
                    presets={maritals}
                    onQueryChange={(key, query) => {
                      setSearchdata(prevState => ({ ...prevState, maritalstatusFieldQuery: query.toString() }))
                      _options.updateQuery(key, query)
                    }}
                  />
                  <FormHelperText>
                    {searchdata.genderFieldQuery.length
                      ? searchdata.maritalstatusFieldQuery
                      : 'Filter by marital status'}
                  </FormHelperText>
                </FormControl>

                <TextField
                  fieldName="Phone"
                  onQueryChange={(key, query) => {
                    setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                    _options.updateQuery(key, query)
                  }}
                  fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'Phone')}
                  helperText={
                    searchdata.phoneFieldQuery ? `Field Query: ${searchdata.phoneFieldQuery}` : 'Query on the Phone'
                  }
                />

                {/* <FormControlA>
                  <InputLabel htmlFor="type-filter">Created at</InputLabel>
                  <PresetField
                    fieldName="CreationDate"
                    presets={[
                      { text: '-', value: new Query(a => a) },
                      { text: 'Today', value: new Query(a => a.term('CreationDate:>@@Today@@')) },
                      {
                        text: 'Yesterday',
                        value: new Query(a =>
                          a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@'),
                        ),
                      },
                    ]}
                    onQueryChange={(key, query) => {
                      setSearchdata(prevState => ({ ...prevState, creationDateQuery: query.toString() }))
                      _options.updateQuery(key, query)
                    }}
                  />
                  <FormHelperText>
                    {searchdata.creationDateQuery.length ? searchdata.creationDateQuery : 'Filter by creation date'}
                  </FormHelperText>
                </FormControlA> */}

                {/* <FormControlA style={{ minWidth: 150 }}>
                  <InputLabel htmlFor="type-filter">Filter by type</InputLabel>
                  <TypeField
                    onQueryChange={query => {
                      setSearchdata(prevState => ({ ...prevState, typeFieldQuery: query.toString() }))
                      _options.updateQuery('Type', query)
                    }}
                    id="type-filter"
                    types={[User]}
                    schemaStore={repo.schemas}
                    getMenuItem={(schema, isSelected) => (
                      <MenuItem key={schema.ContentTypeName} value={schema.ContentTypeName} title={schema.Description}>
                        {isSelected ? (
                          <Checkbox checked={true} style={{ padding: 0 }} />
                        ) : (
                          <Icon type={iconType.materialui} iconName={icons[schema.Icon.toLocaleLowerCase()]} />
                        )}
                        <ListItemText primary={schema.ContentTypeName} />
                      </MenuItem>
                    )}
                  />
                  <FormHelperText>
                    {searchdata.typeFieldQuery.length ? searchdata.typeFieldQuery : 'Filter in all content types'}
                  </FormHelperText>
                </FormControlA> */}

                <button style={{ display: 'none' }} type="submit" />
              </form>
              <Divider />
              <div
                style={{
                  display: 'flex',
                  padding: '1em',
                  justifyContent: 'space-evenly',
                  alignItems: 'baseline',
                }}>
                <MaterialTextField
                  style={{
                    flexGrow: 1,
                  }}
                  helperText="This is the aggregated query from all of the fields above."
                  margin="none"
                  variant="filled"
                  label="Full query"
                  disabled={true}
                  value={searchdata.fullQuery}
                />
                <Button onClick={() => sendRequest()}>
                  <MaterialIcon iconName="play_arrow" /> Send
                </Button>
              </div>
            </Paper>
          )}
        />
        {searchdata.response ? (
          <Paper style={{ margin: '1em', overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchdata.response.d.results.map(r => (
                  <TableRow key={r.Id}>
                    <TableCell>
                      {r.Avatar !== undefined && r.Avatar.Url ? (
                        <img src={repo.configuration.repositoryUrl + r.Avatar.Url} />
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>{r.FullName ? r.FullName : r.LoginName}</TableCell>
                    <TableCell>{r.Email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : null}
      </div>
      <Dialog
        open={searchdata.isHelpOpen}
        onClose={() => setSearchdata(prevState => ({ ...prevState, isHelpOpen: false }))}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This example application is a showcase for the{' '}
            <a href="http://npmjs.com/package/@sensenet/search-react" target="_blank" rel="noopener noreferrer">
              @sensenet/search-react
            </a>{' '}
            package and demonstrates the basic functionality with some predefined field filters and an example query
            result.
            <br />
            In order to get the result, please set up your repository in the <strong>Settings</strong> section and check
            that
            <li>
              Your{' '}
              <a href="https://community.sensenet.com/docs/cors/" target="_blank" rel="noopener noreferrer">
                CORS
              </a>{' '}
              settings are correct
            </li>
            <li>You have logged in / have appropriate rights for the content</li>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchdata(prevState => ({ ...prevState, isHelpOpen: false }))}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserSearchPanel
