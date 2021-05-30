import React, { useEffect } from 'react'
import { removeAdminData } from '../../redux/actions/logoutAction'
import { setAdminData } from '../../redux/actions/loginActions'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router';
import {getToken, removeToken, removeAdminDetails } from '../../reusable'
import { useDispatch, useSelector } from 'react-redux';

const TheHeaderDropdown = () => {
  let admin = getToken()
  let logged = useSelector((state) => state.adminData)
  
  const dispatch = useDispatch();

  const logout = async() => {
    try {
      removeToken()
      removeAdminDetails()
      dispatch(removeAdminData())
    } catch (error) {
      console.error(error);
    }
  }

  const history = useHistory();
  useEffect(() => {
    if(!admin) {
      dispatch(removeAdminData())
      history.push("/login")
    } else {
      dispatch(setAdminData(true))
    }
  }, [logged])


  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/admin.jpg'}
            className="c-avatar-img"
            alt="admin"
          />
          <CBadge color="info" className="mfs-auto">Admin</CBadge><CBadge

          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem>
          <CIcon name="cil-bell" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Change password
        </CDropdownItem>
        <CDropdownItem
          onClick={e => {
            e.preventDefault();
            logout();
          }}>
          <CIcon name="cil-task" className="mfe-2" />
          Logout
        </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
