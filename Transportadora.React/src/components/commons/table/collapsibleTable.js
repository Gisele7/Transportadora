import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Box, Typography, getPopoverUtilityClass } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import '../table/collapsibleTable.css';

function Row(value, index) {
    var item = value.item;
    const [open, setOpen] = useState(false);
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{fontFamily: 'Roboto'}} key={`line-${index}`}>
                <TableCell key={`nome-${index}`}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    {item.nomeEquipamento}
                </TableCell>
                <TableCell component="th" scope="row" style={{fontFamily: 'Roboto'}} key={`btn-${index}`}>
                    {item.botao}
                </TableCell>
            </TableRow>
            <TableRow key={`tableRow-${index}`}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, FontFamily: 'Roboto' }} colSpan={100}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table style={{fontFamili: 'Roboto'}}>
                                <TableHead style={{ fontWeight: 'bold', backgroundColor: '#999797' }}>
                                    Portas
                                </TableHead>
                                <TableBody style={{fontFamily: 'Roboto'}}>
                                    {item.portas?.map((porta, index) =>
                                        <TableRow className="linha" style={{fontFamily: 'Roboto'}} key={`row-${index}`}>
                                            <TableCell key={`cell-${index}`}>
                                                {porta.nome}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

const CollapsibleTabela = ({ columns = [], className = 'responsive', dados = [] }) => {
    var tituloTabela = "";

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Equipamento
                            </TableCell>
                            <TableCell>
                                Ação
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dados.map((item, index) =>
                            <Row item={item} index={index} key={`dados-${index}`}></Row>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default CollapsibleTabela;