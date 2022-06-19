import * as React from 'react'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { getSumFromArray } from '../../../sharedFunctions/sharedFunctions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function PenaltiesList({ penaltiesArray }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const sum = getSumFromArray(
        penaltiesArray.map(penalty => Number(penalty.amount))
    )

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'penalties-list' : undefined

    return (
        <>
            <Button
                aria-describedby={id}
                onClick={handleClick}
                color={'error'}
                style={{
                    border: '1px solid white',
                    padding: '0 20px',
                    minWidth: '0',
                    boxShadow: 'none',
                }}
                size="small"
                variant="contained"
            >
                {`${sum} $`}
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 450 }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {penaltiesArray.map(penalty => (
                                <TableRow
                                    key={penalty.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {penalty.date}
                                    </TableCell>
                                    <TableCell>{penalty.description}</TableCell>
                                    <TableCell align="right">
                                        {`${penalty.amount} $`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Popover>
        </>
    )
}