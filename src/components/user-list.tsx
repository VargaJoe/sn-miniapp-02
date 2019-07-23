import React, { useEffect, useState } from 'react'

// start of material imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import TextField from '@material-ui/core/TextField'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
// end of material imports

// start of sensenet imports
import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { useRepository } from '../hooks/use-repository'
// end of sensenet imports

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      /* maxWidth: 360, */
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
)

/**
 * User List
 */
const UserListPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()
  const [data, setData] = useState<User[]>([])
  // const [newUser, setNewUser] = React.useState<string>('')

  useEffect(() => {
    /**
     * load from repo
     */
    async function loadContents() {
      const result: ODataCollectionResponse<User> = await repo.loadCollection({
        path: `${ConstantContent.PORTAL_ROOT.Path}/IMS`,
        oDataOptions: {
          query: 'TypeIs:User',
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'Avatar', 'Fullname', 'Email'] as any,
          orderby: ['FullName', ['CreationDate', 'desc']],
        },
      })

      setData(result.d.results)
    }
    loadContents()
  }, [repo])

  const Users = data.map(d => {
    const labelId = `checkbox-list-label-${d.Id}`
    const initials = d.FullName == undefined ? d.Name[0] : d.FullName[0]
    const avatar =
      d.Avatar != null && d.Avatar.Url != '' ? (
        <Avatar alt={d.FullName} src={repo.configuration.repositoryUrl + d.Avatar.Url} />
      ) : (
        <Avatar alt={d.FullName}>{initials}</Avatar>
      )

    return (
      <ListItem key={d.Id} alignItems="flex-start">
        <ListItemAvatar>{avatar}</ListItemAvatar>
        <ListItemText id={labelId} primary={`${d.DisplayName}`} />
      </ListItem>
    )
  })

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <List className={classes.root}>{Users}</List>
      </Grid>
    </Grid>
  )
}

export default UserListPanel
