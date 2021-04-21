using BLL.Search;
using BLL.Shared;
using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INTO.Models
{
    public class SearchModel<T> : LoginModel
    {
        public ICollection<SearchResult<T>> SearchResults { get; set; }
        public SearchFilter SearchFilter { get; set; }
    }
}
