using GameTime.Data;
using GameTime.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Repositories
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendRepository : ControllerBase, IFriendRepository
    {
        private readonly ApplicationDbContext _context;

        public FriendRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //get all the friends of a given userId
        public List<User> Get(int userId)
        {
            return _context.Friend
                .Include(f => f.Other)
                .Where(f => f.UserId == userId && f.IsConfirmed && f.Other.IsActive)
                .Select(f => f.Other)
                .ToList();
        }

        //get all unconfirmed friends of a user
        public List<Friend> GetInvites(int userId)
        {
            return _context.Friend
                .Include(f => f.User)
                .Where(f => f.OtherId == userId && !f.IsConfirmed && f.User.IsActive)
                .ToList();
        }

        //add a new friend to the database and return it
        public void Add(Friend friend)
        {
            _context.Add(friend);
            _context.SaveChanges();
        }

        //check if the given friend already exists in the database
        public bool Exists(Friend friend)
        {
            var found = _context.Friend
                .Where(f => f.UserId == friend.UserId && f.OtherId == friend.OtherId)
                .FirstOrDefault();
            if(found == null)
            {
                return false;
            }
            return true;
        }

        public Friend GetById(int id)
        {
            return _context.Friend
                .Where(f => id == f.Id)
                .FirstOrDefault();
        }

        //update a given friend
        public void Confirm(Friend friend)
        {
            //check that the given friend exits
            var original = GetById(friend.Id);
            if (original == null)
            {
                return;
            }
            
            //detach from original friend and update with new data
            _context.Entry(original).State = EntityState.Detached;
            _context.Entry(friend).State = EntityState.Modified;
            _context.SaveChanges();
        }

        //remove a given friend and it's related friend from the database
        public void Delete(Friend friend)
        {
            // get the other friend
            var other = _context.Friend
                .Where(f => f.UserId == friend.OtherId && f.OtherId == friend.UserId)
                .FirstOrDefault();

            // remove both friends from the database
            _context.Friend.Remove(other);
            _context.Friend.Remove(friend);

            _context.SaveChanges();

        }
    }
}
