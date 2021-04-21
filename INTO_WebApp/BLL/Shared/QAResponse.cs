using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{

    public class QAResponse<T>
    {
        public T Content { get; set; }
        public IDictionary<string, string> Extras { get; set; }

        public QAResponse() {
            this.Extras = new Dictionary<string, string>();
        }
        public QAResponse(T content)
        {
            this.Content = content;
        }
        public QAResponse(T content, IDictionary<string, string> extras)
        {
            this.Content = content;
            this.Extras = extras;
        }
    }
}