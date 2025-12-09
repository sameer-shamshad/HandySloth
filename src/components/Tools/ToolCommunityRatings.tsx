import type { Tool } from '../../types';
import { useAuth, useModal } from '../../context';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { upvoteTool, downvoteTool, addToolRating } from '../../services/tools.service';
import { addUpvotedTool, removeUpvotedTool } from '../../store/features/userReducer';
import AuthModal from '../AuthModal';

interface ToolCommunityRatingsProps {
  tool: Tool | undefined;
  onToolUpdate?: (updatedTool: Tool) => void;
}

const ToolCommunityRatings = ({ tool, onToolUpdate }: ToolCommunityRatingsProps) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const userId = user?._id;
  const { upvotedToolIds } = useAppSelector((state) => state.user);
  const [selectedRating, setSelectedRating] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  // Check if user has already rated
  useEffect(() => {
    if (tool?.ratings && userId) {
      const userRating = tool.ratings.find(r => r.userId === userId);
      setHasRated(!!userRating);
      if (userRating) {
        setSelectedRating(userRating.rating);
        setFeedback(userRating.feedback);
      }
    } else {
      setHasRated(false);
    }
  }, [tool?.ratings, userId]);

  useEffect(() => {
    if (isAuthenticated && upvotedToolIds.length > 0) {
      setIsUpvoted(upvotedToolIds.includes(tool?._id || ''));
    }
  }, [tool?._id, isAuthenticated, upvotedToolIds]);

  // Calculate ratings statistics
  const ratings = tool?.ratings || [];
  const totalRatings = ratings.length;
  
  // Calculate average rating
  const averageRating = totalRatings > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
    : 0;

  // Calculate star distribution (how many users rated each star level)
  const starDistribution = [5, 4, 3, 2, 1].map(star => ({
    stars: star,
    count: ratings.filter(r => r.rating === star).length
  }));

  const handleStarClick = (rating: number) => {
    if (hasRated) return; // Disable star clicks if user has already rated
    setSelectedRating(rating);
  };

  const handlePost = async () => {
    if (!tool || isRatingLoading) return;
    
    // If user is not authenticated, show login modal
    if (!isAuthenticated || !userId) {
      openModal({
        component: <AuthModal />,
        title: '',
        size: 'sm',
      });
      return;
    }
    
    if (hasRated) { // Block if user has already rated (forever)
      setRatingError('You have already rated this tool and cannot rate it again.');
      return;
    }
    
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setRatingError('Please select a rating between 1 and 5 stars');
      return;
    }

    setIsRatingLoading(true);
    setRatingError(null);

    try {
      await addToolRating(tool._id, selectedRating, feedback);
      
      if (tool && userId) {
        const newRating = {
          userId,
          rating: selectedRating,
          feedback,
        };
        const updatedTool: Tool = {
          ...tool,
          ratings: [...(tool.ratings || []), newRating],
        };
        
        setHasRated(true); // Update local state
        
        if (onToolUpdate) { // Notify parent component to update tool
          onToolUpdate(updatedTool);
        }
      }
      
      // Clear feedback after successful submission (but keep rating visible)
      setFeedback('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating';
      setRatingError(errorMessage);
      console.error('Failed to submit rating:', error);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated || !userId || !tool || isLoading) return;

    setIsLoading(true);
    const previousUpvoteState = isUpvoted;

    // Optimistically update UI
    setIsUpvoted(!isUpvoted);

    try {
      const updatedTool = previousUpvoteState
        ? await downvoteTool(tool._id)
        : await upvoteTool(tool._id);
      
      // Update tool votes
      tool.votes = updatedTool.tool.votes;
      
      // Update Redux state for real-time updates
      if (previousUpvoteState) {
        // Removing upvote - dispatch remove action with tool ID
        dispatch(removeUpvotedTool(tool._id));
      } else {
        // Adding upvote - dispatch add action with tool ID
        dispatch(addUpvotedTool(tool._id));
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsUpvoted(previousUpvoteState);
      console.error('Failed to update vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 bg-transparent lg:bg-primary-bg px-3 lg:px-6 py-4 rounded-3xl">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-primary-color">Community Ratings</h3>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            className="bi bi-star-fill text-secondary-color"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
          <span className="text-4xl font-bold text-primary-color">{averageRating}</span>
        </div>

        {totalRatings === 0 && (
          <p className="text-sm text-secondary-color">No ratings yet.</p>
        )}

        <div className="w-full flex flex-col gap-2">
          {starDistribution.map(({ stars, count }) => (
            <div key={stars} className="w-full sm:max-w-sm flex items-center justify-between gap-3 border-b py-3">
              <div className="flex items-center gap-1">
                {[...Array(stars)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-star-fill text-primary-color"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                ))}
              </div>

              <span className="text-xs text-secondary-color w-8 text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Rating Input Section */}
        <h3 className="text-lg font-bold text-primary-color mt-3">How would you rate this tool?</h3>
        
        <p className="text-sm text-secondary-color">
          Help other people by letting them know if this AI was useful.
        </p>

        <label className="text-sm font-medium text-primary-color">Your rating</label>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              disabled={hasRated}
              className="focus:outline-none bg-transparent! disabled:opacity-80 disabled:cursor-not-allowed"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className={`bi bi-star-fill ${star <= selectedRating ? 'text-main-color' : 'text-secondary-color'} dark:text-secondary-color'
                }`}
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            </button>
          ))}
        </div>

        {hasRated && isAuthenticated && (
          <div className="text-sm text-secondary-color bg-secondary-bg/40 px-4 py-3 rounded-lg">
            You have already rated this tool. You cannot rate it again.
          </div>
        )}

        {!hasRated && (
          <>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Let people know what you think about ${tool?.name || 'this tool'}. It helps to provide much detail as possible about your experience.`}
              className="w-full min-h-[120px] rounded-md border border-border-color bg-secondary-bg/40 px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color resize-none"
              disabled={isRatingLoading || hasRated}
            />

            {ratingError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                {ratingError}
              </div>
            )}

            <button
              type="button"
              onClick={handlePost}
              disabled={isRatingLoading || !selectedRating || hasRated}
              className="w-min rounded-md bg-[#3E3E3E]! dark:bg-[#404758]! px-8! py-3! text-sm font-medium text-white! disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRatingLoading ? 'Submitting...' : 'Post'}
            </button>
          </>
        )}
      </div>

      {/* Upvote Section */}
      {isAuthenticated && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-primary-color">Upvote this Tool</h3>
          
          <button
            type="button"
            onClick={handleUpvote}
            disabled={isLoading}
            className={`max-w-xs flex items-center justify-center gap-2 rounded-xl px-6 py-2! text-base font-semibold ${
              isUpvoted 
                ? 'bg-red-500! text-white!' 
                : 'bg-[#A9ECAD]! text-black-color!'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="material-symbols-outlined text-sm! p-1! px-2! border rounded-full">
              {isUpvoted ? 'arrow_downward' : 'arrow_upward'}
            </span>
            <span>{isUpvoted ? 'Downvote' : 'Upvote'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolCommunityRatings;