using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Commens
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDTO>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }

            public Task<Unit> Handle(Result<CommentDTO> request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
            public class Handler : IRequestHandler<Command, Result<CommentDTO>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;
                private readonly IUserAccessor _userAccessor;

                public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
                {
                    _context = context;
                    _mapper = mapper;
                    _userAccessor = userAccessor;
                }
                public async Task<Result<CommentDTO>> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.FindAsync(request.ActivityId);

                    if (activity == null) return null;

                    var user = await _context.Users
                        .Include(p => p.Photos)
                        .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                    var comment = new Comment
                    {
                        Activity = activity,
                        Author = user,
                        Body = request.Body
                    };
                    
                    _context.Comments.Add(comment);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return Result<CommentDTO>.Success(_mapper.Map<CommentDTO>(comment));

                    return Result<CommentDTO>.Failure("Failed to add comment");
                }
            }
        }
    }
}
