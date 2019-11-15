import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Repository } from '@sensenet/client-core'
import Button from '@material-ui/core/Button'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { Dialog } from '@material-ui/core'
import MaterialTextField from '@material-ui/core/TextField'
import { AdvancedSearch } from '@sensenet/search-react/dist/Components/AdvancedSearch'
import UserSearchPanel from '../src/components/user-search'
import { TestUserList } from './_mocks_/test_contents'
//import { PresetField } from '@sensenet/search-react/dist/Components/Fields/PresetField'

describe('The user search component instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestUserList } } as any)
    }
  })

  it('should renders correctly', () => {
    const l = shallow(<UserSearchPanel />)
    expect(l).toMatchSnapshot()
  })

  it('should search and user listing by click event', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const searchbtn = wrapper.update().find(Button)
    await act(async () => {
      ;(searchbtn.prop('onClick') as any)()
    })

    const TableRows = wrapper
      .update()
      .find(TableBody)
      .find(TableRow)

    expect(TableRows.length).toEqual(TestUserList.length)
  })

  it('should search and user listing on submit', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })

    const TableRows = wrapper
      .update()
      .find(TableBody)
      .find(TableRow)

    expect(TableRows.length).toEqual(TestUserList.length)
  })

  it('should open modal window', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })

    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(true)
  })
  it('should close modal window on close button', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })
    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    act(() => {
      wrapper
        .update()
        .find(Dialog)
        .prop('onClose')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(false)
  })
  it('should close modal window on OK button', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })
    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    act(() => {
      wrapper
        .update()
        .find(Dialog)
        .find(Button)
        .prop('onClick')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(false)
  })

  it('should change query if change any field', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const advsearchpanel = wrapper.update().find(AdvancedSearch)
    act(() => {
      advsearchpanel.prop('onQueryChanged')("LoginName:'*businesscat*'")
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual("LoginName:'*businesscat*'")
  })

  it('should change language dropdown', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('Language:English')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('Language:English')
  })

  it('should change Gender dropdown', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('Gender:Female')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('Gender:Female')
  })

  it('should change MaritalStatus dropdown', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('MaritalStatus:Single')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('MaritalStatus:Single')
  })

  it('should maritalstatus is empty', async () => {
    repo.schemas = {
      getSchemaByName: function schemasfn() {
        return { FieldSettings: [] }
      },
    }

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('MaritalStatus:Single')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('MaritalStatus:Single')
  })
})
