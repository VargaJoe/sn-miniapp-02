import { mount, shallow } from 'enzyme'
import React from 'react'
import { IconButton } from '@material-ui/core'
import HeaderPanel from '../src/components/header'
import { RepositoryContext } from '../src/context/repository-provider'

describe('Header', () => {
  it('Matches snapshot', () => {
    const l = shallow(<HeaderPanel />)
    expect(l).toMatchSnapshot()
  })
  it('Logout function', () => {
    const logoutfn = jest.fn()
    const wrapper = mount(
      <RepositoryContext.Provider value={{ authentication: { logout: logoutfn } } as any}>
        <HeaderPanel />
      </RepositoryContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')
    expect(logoutfn).toBeCalled()
  })
})
