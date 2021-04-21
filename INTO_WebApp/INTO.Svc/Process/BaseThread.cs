using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INTO.Svc.Process
{
    public abstract class BaseThread
    {
        private Thread _thread;

        protected BaseThread()
        {
            _thread = new Thread(new ThreadStart(this.Execute));
        }

        // Thread methods / properties
        public void Start() => _thread.Start();
        public void Join() => _thread.Join();
        public bool IsAlive => _thread.IsAlive;

        // Override in base class
        protected abstract void Execute();
    }
}
