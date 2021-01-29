using GameTime.Data;
using GameTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public User GetByFirebaseUserId(string firebaseUserId)
        {
            return _context.User.FirstOrDefault(u => u.FirebaseUserId == firebaseUserId);

        }

        public User GetById(int id)
        {
            return _context.User
                .FirstOrDefault(u => u.Id == id);
        }

        public List<User> GetAll()
        {
            return _context.User.Where(u => u.IsActive).ToList();
        }
    }
}
