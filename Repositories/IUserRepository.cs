using GameTime.Models;

namespace GameTime.Repositories
{
    public interface IUserRepository
    {
        User GetByFirebaseUserId(string firebaseUserId);
        User GetById(int id);
    }
}