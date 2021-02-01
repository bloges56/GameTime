using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Models
{
    public class UserSession
    {
        public int Id { get; set; }
        
        [Required]
        public int SessionId { get; set; }
        public Session Session { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        public bool IsConfirmed { get; set; }
    }
}
