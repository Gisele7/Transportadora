function ConfiguraDataTable(nomeTabela) {
    $(nomeTabela).DataTable({
        "ordering": true,
        "info": false,
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "Nenhum registro encontrado.",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "processing": "",
            "paginate": {
                "first": "Primeira",
                "last": "Última",
                "next": "Próxima",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": Ordenar colunas de forma ascendente",
                "sortDescending": ":  Ordenar colunas de forma descendente"
            }
        }
    });
}

