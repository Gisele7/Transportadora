import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircleIcon from '@mui/icons-material/Circle';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import EngineeringIcon from '@mui/icons-material/Engineering';
import 'moment/locale/pt-br'
import '../table/table.css'
import SearchBar from "material-ui-search-bar";


const Tabela = ({ columns = [], className = 'responsive', dados = [], showPagination = false }) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50)

  

    var tituloTabela = "";
    function CriarColunas(tipoColuna, value) {
        switch (tipoColuna) {
            case ("texto"):
                return value.name;
                break;
            case ("data"):
                return moment(value.name).format("DD/MM/YYYY");
                break;
            case ("dataHora"):
                return moment(value.name).locale('pt-br').format("LLL")
            case ("botao"):
                var botoes = [];
                value.botoes.map(item => {
                    botoes.push(item.botao)
                })
                return botoes
                break;
            case ("icone"):
                return VerificaStatus(value.name)
                break;
        }
    }

    function VerificaStatus(status) {
        switch (status) {
            case (1):
                return <CircleIcon style={{ color: "green" }}></CircleIcon>
            case (2):
                return <AccessAlarmIcon></AccessAlarmIcon>
            case (3):
                return <WifiOffIcon></WifiOffIcon>
            case (4):
                return <EngineeringIcon></EngineeringIcon>
            case (5):
                return <CircleIcon style={{ color: "#999797" }}></CircleIcon>


        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <h2>{tituloTabela}</h2>

            <TableContainer component={Paper}>
                <Table key="table" size="small" aria-label="simple table" style={{ fontFamily: 'Roboto' }}>
                    <TableHead style={{ backgroundColor: "#eeeeee", fontFamily: 'Roboto' }}>
                        <TableRow key="linha" style={{ fontFamily: 'Roboto' }}>
                            {columns.map(column => <TableCell key={column.nome}>
                                {column.nome}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ fontFamily: 'Roboto' }}>
                        {(
                            rowsPerPage > 0
                                ? dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : dados
                        ).map((dado, index) => (
                            <TableRow key={`linha-${index}}`} className={dado[0].corLinha} style={{ fontFamily: 'Roboto' }}>
                                {columns.map((col, index) => <TableCell key={`col-${index}`}>
                                    {dado[index] == null ? "" : CriarColunas(col.tipoColuna, dado[index])}
                                </TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {showPagination ?
                <TablePagination
                    style={{ fontFamily: 'Roboto' }}
                    rowsPerPageOptions={[50, 100, 150, 200, { label: 'Todos', value: -1 }]}
                    component="div"
                    count={dados.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage='Registros por página'
                    // slotProps={{
                    //     select: {
                    //         'aria-label': 'rows per page',
                    //     },
                    //     actions: {
                    //         showFirstButton: true,
                    //         showLastButton: true,
                    //     },
                    // }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                : ""}
        </>
    )
}

export default Tabela;