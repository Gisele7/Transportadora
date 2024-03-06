import SweetAlert2 from 'react-sweetalert2';
import '../helpers/msgBox.css'


export default class MsgBox {
    // static Show(message, type = 'i', title = '') {
    //     this.Show({message, type, title});
    // }

    //


    //Método com um objeto, passando todos os argumentos
    static Show({ message, type = 'i', title = '', onClose = null }) {
        //se argumento = string, ou seja, 
        if (typeof arguments[0] == 'string') {
            message = arguments[0];

            if (arguments.length > 1) {
                type = arguments[1];
            }
            if (arguments.length > 2) {
                title = arguments[2];
            }
        }


        //Apenas um switch case para refatorar o tipo do icon
        switch (type) {
            case 's':
                type = 'success'
                break;
            case 'w':
                type = 'warning'
                break;
            case 'e':
                type = 'error'
                break;
            case 'i':
                type = 'info'
                break;
            default:
                break;
        }

        const sweetAlertOptions = { text: message, icon: type }

        if (title != '') {
            sweetAlertOptions['title'] = title
        }

        if (onClose) {
            sweetAlertOptions['didClose'] = onClose;
        }

        return Swal.fire(
            sweetAlertOptions
        )
    }
    static ConfirmExclude({ message, type = '', title = '', btnCancel = true,
        textConfirm = '' }) {
        const teste = {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }

        const sweetAlertOptionsExclude = {
            title: '',
            text: message,
            icon: type,
            showCancelButton: btnCancel,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: textConfirm
        }

        if (title != '') {
            sweetAlertOptionsExclude['title'] = title
        }

        return Swal.fire(sweetAlertOptionsExclude)
    }

    static Return({ message, type = '', title = '', btnCancel = true,
        textConfirm = '' }) {

        console.log('textConfirm', textConfirm)

        const sweetAlertOptionsReturn = {
            title: '',
            input: 'text',
            text: message,
            icon: type,
            showCancelButton: btnCancel,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: textConfirm
        }

        if (title != '') {
            sweetAlertOptionsReturn['title'] = title
        }

        return Swal.fire(sweetAlertOptionsReturn)

    }
    // Swal.fire({
    //     title: 'Submit your Github username',
    //     input: 'text',
    //     inputAttributes: {
    //       autocapitalize: 'off'
    //     },
    //     showCancelButton: true,
    //     confirmButtonText: 'Look up',
    //     showLoaderOnConfirm: true,
    //     preConfirm: (login) => {
    //       return fetch(`//api.github.com/users/${login}`)
    //         .then(response => {
    //           if (!response.ok) {
    //             throw new Error(response.statusText)
    //           }
    //           return response.json()
    //         })
    //         .catch(error => {
    //           Swal.showValidationMessage(
    //             `Request failed: ${error}`
    //           )
    //         })
    //     },
    //     allowOutsideClick: () => !Swal.isLoading()
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       Swal.fire({
    //         title: `${result.value.login}'s avatar`,
    //         imageUrl: result.value.avatar_url
    //       })
    //     }
    //   })

}
