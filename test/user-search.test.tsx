import { shallow } from 'enzyme'
import React from 'react'
import UserSearchPanel from '../src/components/user-search'

describe('FullScreenLoader', () => {
  it('Matches snapshot', () => {
    const l = shallow(<UserSearchPanel />)
    expect(l).toMatchSnapshot()
  })
})
