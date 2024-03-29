﻿using GameTime.Data;
using GameTime.Models;
using Microsoft.AspNetCore.Http;
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
            var user = _context.User.FirstOrDefault(u => u.FirebaseUserId == firebaseUserId);
            return user;

        }

        public User GetById(int id)
        {
            try
            {
                return _context.User
                .Where(u => u.IsActive)
                .FirstOrDefault(u => u.Id == id);
            }
            catch
            {
                return null;
            }
            
        }

        //get a user by their username
        public User GetByUsername(string username)
        {
            return _context.User
                .Where(u => u.UserName == username && u.IsActive)
                .FirstOrDefault();
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
