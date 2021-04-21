using System.Collections.Generic;

namespace BLL.Shared
{
    public static class App
    {
        public static IList<Country> Countries = new List<Country>();
        public enum Gender
        {
            Female = 0,
            Male = 1
        }
    }
}
