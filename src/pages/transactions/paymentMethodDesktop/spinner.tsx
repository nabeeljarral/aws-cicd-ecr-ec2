import { asset } from '@/utils/functions/global'
import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from '../../../styles/styles'

const Spinner = () => {
  return (
    <Box
    sx={styles.spinnerWrapper}
>
    <Box>
        <img
            src={asset(`img/spinner.svg`)}
            alt={` logo`}
            style={{position: 'relative', width: '100%'}}
        />

        <Box>
            <Typography variant="h4" sx={{color: 'white', textAlign: 'center'}}>
                Processing payment
            </Typography>
        </Box>
    </Box>

    <Box sx={{position:'absolute',bottom:"250px"}}>
        <Typography variant="body2" sx={{color: 'white'}}>
            Please do not press back or close the app
        </Typography>
    </Box>
</Box>
  )
}

export default Spinner