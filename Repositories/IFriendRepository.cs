using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IFriendRepository
    {
        void Add(Friend friend);
        void Confirm(Friend friend);
        void Delete(Friend friend);
        bool Exists(Friend friend);
        List<User> Get(int userId);
        Friend GetById(int id);
        List<Friend> GetInvites(int userId);
    }
}