﻿using GameTime.Models;
using GameTime.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GameTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly IFriendRepository _friendRepo;
        private readonly IUserRepository _userRepo;
        private readonly IUserSessionRepository _userSessionRepo;
        private readonly ISessionRepository _sessionRepo;
        public FriendController(IFriendRepository friendRepo, IUserRepository userRepo, IUserSessionRepository userSessionRepo, ISessionRepository sessionRepo)
        {
            _userRepo = userRepo;
            _friendRepo = friendRepo;
            _userSessionRepo = userSessionRepo;
            _sessionRepo = sessionRepo;
        }

        // endpoint for getting all the friends of a user
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // check that the user exists
            var user = _userRepo.GetById(id);
            if(user == null)
            {
                return BadRequest();
            }

            // check that the current user is equal to the passed user
            var currentUser = GetCurrentUserProfile();
            if(user != currentUser)
            {
                return Unauthorized();
            }

            // return all the friends of the given user
            var friends = _friendRepo.Get(id);
            return Ok(friends);
        }

        // get all the excluded friends of current user and a given session
        [HttpGet("excluded/{id}")]
        public IActionResult GetExcluded(int id)
        {
            // check that the given session exists
            var session = _sessionRepo.GetById(id);
            if(session == null)
            {
                return BadRequest();
            }

            //get all the users already in a current session
            var currentUser = GetCurrentUserProfile();
            var usersInSession = _userSessionRepo.Get(currentUser.Id, id);

            // get all the friends of the current user
            var friends = _friendRepo.Get(currentUser.Id);

            // filter out the friends that are already invited to the session
            var excluded = friends.Except(usersInSession);

            // return the excluded friends
            return Ok(excluded);
        }

        //endpoint to add a friend to the database
        [HttpPost]
        public IActionResult Add(Friend friend)
        {
            //make sure that the userId's of the friend are valid
            var user = _userRepo.GetById(friend.UserId);
            var other = _userRepo.GetById(friend.OtherId);
            if(user == null || other == null)
            {
                return BadRequest();
            }

            //make sure that userId matches the current user
            var currentUser = GetCurrentUserProfile();
            if(currentUser.Id != friend.UserId)
            {
                return Unauthorized();
            }

            //check if there is a duplicate friend already in the database
            if (_friendRepo.Exists(friend))
            {
                return BadRequest();
            }
            //ensure that the friend is not confirmed
            friend.IsConfirmed = false;
            _friendRepo.Add(friend);
            return Ok(friend);
        }

        private User GetCurrentUserProfile()
        {
            try
            {
                var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return _userRepo.GetByFirebaseUserId(firebaseUserId);
            }
            catch
            {
                return null;
            }
        }
    }
}
