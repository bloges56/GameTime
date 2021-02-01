using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GameTime.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(28)]
        public string FirebaseUserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [MaxLength(255)]
        [DataType(DataType.ImageUrl)]
        public string ImageUrl { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Bio { get; set; }

        public bool IsActive { get; set; }
    }
}
