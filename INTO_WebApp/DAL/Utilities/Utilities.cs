using System.Data.SqlClient;

namespace DAL.Utilities
{
    public class Utilities
    {
        private static bool ColumnExists(SqlDataReader reader, string columnName)
        {
            using (var schemaTable = reader.GetSchemaTable())
            {
                if (schemaTable != null)
                    schemaTable.DefaultView.RowFilter = string.Format("ColumnName= '{0}'", columnName);

                return schemaTable != null && (schemaTable.DefaultView.Count > 0);
            }
        }
    }
}

