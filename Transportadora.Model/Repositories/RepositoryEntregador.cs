﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public  class RepositoryEntregador : RepositoryBase<Entregadores>, IEntregador
    {
        public RepositoryEntregador(bool SaveChanges = true) : base(SaveChanges)
        {

        }

    }
}