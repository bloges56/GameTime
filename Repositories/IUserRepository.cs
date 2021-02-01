using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IUserRepository
    {
        void Add(User userProfile);
        List<User> GetAll();
        User GetByFirebaseUserId(string firebaseUserId);
        User GetById(int id);
    }
}