using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public UserActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;

            public Handler(IMapper mapper, DataContext context)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                     .Include(x => x.AppUser)
                     .Include(x => x.Activity).ThenInclude(x => x.Attendees)
                     .Where(x => x.AppUser.UserName == request.Params.UserName)
                     .AsQueryable();

                switch (request.Params.Predicate)
                {
                    case "past":
                        query = query.Where(x => x.Activity.Date <= DateTime.UtcNow);
                        break;
                    case "future":
                        query = query.Where(x => x.Activity.Date > DateTime.UtcNow);
                        break;
                    case "hosting":
                        query = query.Where(x => x.IsHost == true);
                        break;
                }

                var result = await query.ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).ToListAsync();

                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}
