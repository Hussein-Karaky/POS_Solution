using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ELPServer.Controllers.Shared
{
    public abstract class AppController<T> : Controller where T : Controller
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<T> _logger;
        public AppController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public AppController(ILogger<T> logger)
        {
            this._logger = logger;
        }
        public IConfiguration GetConfiguration()
        {
            return this.configuration;
        }
        public ILogger<T> GetLogger()
        {
            return this._logger;
        }
    }
}
