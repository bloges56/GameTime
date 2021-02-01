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
            try
            {
                return _context.User
                .FirstOrDefault(u => u.Id == id);
            }
            catch
            {
                return null;
            }
            
        }

        public List<User> GetAll()
        {
            return _context.User.Where(u => u.IsActive).ToList();
        }

        public void Add(User userProfile)
        {
            _context.Add(userProfile);
            _context.SaveChanges();
        }
    }
}
