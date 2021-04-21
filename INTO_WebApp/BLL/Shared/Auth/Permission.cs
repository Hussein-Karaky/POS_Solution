using System;
using System.Collections.Generic;

namespace BLL.Shared.Auth
{
    public class Permission
    {
        public IList<Uri> Resources = new List<Uri>();
    }
}
