using System;
using System.Data.SqlClient;

namespace BLL.Shared
{
    public class Location : DataEntity<DataEntityCache<Location>, Location>
    {
        public Location() : base() { }
        public Location(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public override DataEntityCache<Location> Cache(DataEntityCache<Location> cache = null)
        {
            throw new NotImplementedException();
        }
        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            string latCol = string.Concat(prefix == null ? "" : prefix, nameof(Latitude));
            string lngCol = string.Concat(prefix == null ? "" : prefix, nameof(Longitude));
            this.Latitude = rdr[latCol] != DBNull.Value ? Convert.ToDecimal(rdr[latCol]) : default(decimal?);
            this.Longitude = rdr[lngCol] != DBNull.Value ? Convert.ToDecimal(rdr[lngCol]) : default(decimal?);
        }
    }
}
