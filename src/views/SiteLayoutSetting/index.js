import { Typography } from '@material-ui/core'
import React from 'react'
import ServiceLayout from './ServiceLayout'

function LayoutSetting() {
    return (
        <div>
        <div>
        <Typography variant='h3' align='center' style={{margin:"10px 0"}}>Service Page Layout</Typography>
        <ServiceLayout/>
        </div>
            
        </div>
    )
}

export default LayoutSetting
