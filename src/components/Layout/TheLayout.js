import React, { useEffect } from 'react'
import { axios, getToken } from '../../reusable'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const TheLayout = () => {
  
  useEffect(async () => {
    try {
      const admin = getToken()
      let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
      }
      let response = await axios
        .get('setting', { headers })
        .catch(err => {
          console.log(err);
        })
      if (response?.data?.status_code === 200) {
        localStorage.setItem("settings", JSON.stringify(response?.data?.data?.setting))
        dispatch(setAdminData(true))
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
