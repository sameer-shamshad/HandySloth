import { useAuth } from "../context";
import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { formatRelativeTime } from "../utils/time";
import type { Tool, ToolCategory } from "../types";
import { fetchToolById, incrementToolView } from "../services/tools.service";
import ToolNotFound from "../components/Tools/ToolNotFound";
import { useParams, Link, useNavigate } from "react-router-dom";
import ToolCommunityRatings from "../components/Tools/ToolCommunityRatings";

const ToolViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toolIds: userToolIds } = useAppSelector((state) => state.user);
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [popularAlternative, setPopularAlternative] = useState<{ _id: string; name: string; totalSaved: number; totalAlternatives: number } | null>(null);

  // Fetch tool by ID from API
  useEffect(() => {
    if (!id) {
      setFetchError(true);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchTool = async () => {
      setFetchError(false);
      setIsLoading(true);
      
      try {
        const response = await fetchToolById(id);
        
        if (isCancelled) return;
        
        const fetchedTool = response.tool;
        
        // Set the tool in state
        setTool(fetchedTool);
        
        // Set popular alternative from the response
        if (response.alternative) {
          setPopularAlternative({
            _id: response.alternative.tool?._id || '',
            name: response.alternative.tool?.name || '',
            totalSaved: response.alternative.totalSaved || 0,
            totalAlternatives: response.alternative.totalAlternatives || 0,
          });
        }
        
        setFetchError(false);
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to fetch tool:', error);
          setFetchError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchTool();
    
    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !tool || !isAuthenticated || !user?._id) {
      return;
    }

    // Check if user ID is already in views array - if yes, don't make API call
    const hasViewed = tool.views?.includes(user._id);
    if (hasViewed) return; // User already viewed, no need to increment

    // Increment view
    const incrementView = async () => {
      try {
        await incrementToolView(id);
        
        setTool((prevTool) => {
          if (!prevTool) return prevTool;

          return { ...prevTool, views: [...(prevTool.views || []), user._id!] };
        });
      } catch (error) {
        console.error('Failed to increment tool view:', error);
        // Silently fail - don't show error to user
      }
    };

    incrementView();
  }, [id, tool, isAuthenticated, user?._id]);

  const handleEditTool = () => {
    navigate(`/tool/edit-tool`, { state: { tool } });
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  // Show error only if fetch failed and we're not loading
  if (fetchError && !isLoading && !tool) {
    return <ToolNotFound />;
  }

  // Show loading while fetching or if tool not found yet (will be found after fetch completes)
  if (isLoading || !tool) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5 px-4">
        <Link 
          to={`/category/${tool?.primaryCategory}`}
          className="flex items-center gap-2 bg-black-color dark:bg-primary-bg rounded-md px-2 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-gray-400! text-lg!">
            signal_cellular_alt
          </span>
          <span className="text-white text-sm">{tool?.primaryCategory}</span>
        </Link>

        <div className="flex items-center ">
          <span className="material-symbols-outlined text-gray-500! text-lg!">
            history
          </span>
          <span className="text-sm text-gray-400!">{tool?.createdAt ? `Added ${formatRelativeTime(new Date(tool.createdAt).getTime())}` : 'Added recently'}</span>
        </div>
      </div>

      <main className="gap-6 flex flex-col bg-primary-bg px-6 py-15 rounded-3xl">
        <div className="flex items-start gap-2 rounded-xl">
          <img
            src={
              tool?.logo
                ? tool.logo
                : "https://mrvian.com/wp-content/uploads/2023/02/logo-open-ai.png"
            }
            alt={tool?.name || "Tool Logo"}
            className="w-12 h-12 rounded-xl object-cover text-primary-color"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-primary-color text-wrap">
              {tool?.name || "Open AI"}
            </h3>
            <Link 
              to={`/category/${tool?.primaryCategory}`}
              className="text-sm text-secondary-color -mt-2 hover:text-primary-color transition-colors"
            >
              {tool?.primaryCategory}
            </Link>
          </div>

          <div
            className="flex items-center gap-1 lg:gap-3 ml-auto *:p-1 *:bg-main-color! *:dark:bg-primary-bg! *:dark:text-primary-color! *:text-black-color! 
            *:rounded-full! *:border-white! *:border *:lg:p-2! *:xl:dark:shadow-[0_0_10px_0.1px_#A9ECEC]! *:xl:shadow-none! [&>a>h4]:hidden! 
            xl:[&>a>span]:hidden! xl:[&>a>h4]:block! xl:[&>a>h4]:text-sm! xl:[&>a>h4]:font-extralight! xl:[&>a>h4]:text-primary-color! xl:[&>a]:px-4!"
          >
            {tool?.links.telegram && (
              <a href={tool?.links.telegram || "#"}>
                <span>{socialIcons.telegram}</span>
                <h4>Telegram</h4>
              </a>
            )}
            {tool?.links.x && (
              <a href={tool?.links.x || "#"}>
                <span>{socialIcons.X}</span>
                <h4>X</h4>
              </a>
            )}
            {tool?.links.website && (
              <a href={tool?.links.website || "#"}>
                <span>{socialIcons.website}</span>
                <h4>Website</h4>
              </a>
            )}

            <button
              type="button"
              onClick={handleBookmark}
              className="flex items-center gap-1 p-1! rounded-full! border"
            >
              {isBookmarked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-bookmark"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-bookmark"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
              )}

              <span className="text-sm text-primary-color hidden lg:block">
                Save
              </span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className="material-symbols-outlined bg-transparent! text-xs! rounded-full! border-none! shadow-none! hidden! lg:block!"
            >
              more_vert
            </button>
          </div>
        </div>
        {/* Tool Info */}
        <div className="flex flex-col">
          <h4 className="w-max text-sm text-primary-color bg-group-bg rounded-tl-xl rounded-tr-xl px-4 py-1">
            Author
          </h4>

          <div className="flex items-center gap-2 bg-group-bg rounded-bl-xl rounded-br-xl rounded-tr-xl px-4 py-2">
            <img
              src={
                tool?.logo
                  ? tool.logo
                  : "https://mrvian.com/wp-content/uploads/2023/02/logo-open-ai.png"
              }
              alt={tool?.name}
              className="w-9 h-9 object-cover rounded-full text-primary-color"
            />

            <h3 className="text-sm truncate! font-bold text-primary-color">
              {tool?.author?.username}
            </h3>

            <div className="flex items-center gap-1 text-primary-color text-xs lg:ml-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                className="bi bi-tools"
                viewBox="0 0 16 16"
              >
                <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" />
              </svg>
              <span className="w-max">{userToolIds.length} tool{userToolIds.length > 1 ? 's' : ''}</span>
            </div>

            {
              isAuthenticated && user && tool?.author?._id === user._id ? (
                <button 
                  type="button"
                  onClick={handleEditTool}
                  className="flex items-center gap-1 lg:gap-2! bg-transparent! text-primary-color text-xs ml-auto"
                >
                  <span className="material-symbols-outlined text-[16px]!">edit</span>
                  <span>Edit Tool</span>
                </button>
              ) : (
                <button 
                  type="button"
                  className="flex items-center gap-1 lg:gap-2 bg-transparent! text-primary-color text-xs ml-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-envelope-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                  </svg>
                  <span>Message</span>
                </button>
              )
            }
          </div>
        </div>
        <p className="text-xs text-secondary-color">{tool?.shortDescription}</p>
      </main>

      <main className="h-min flex flex-col xl:flex-row gap-6 bg-primary-bg xl:bg-transparent px-3 xl:-mx-6 py-8 rounded-3xl">
        <div className="w-full flex flex-col gap-4 overflow-y-auto">
          {
            Array.isArray(tool?.toolImages) && tool.toolImages.length > 0 && tool.toolImages.filter((_, i) => i === 0).map((image: string, index: number) => (
              <img
                key={index}
                alt="Tool Usage Image"
                src={image}
                className="w-full h-auto rounded-xl"
              />
            ))
          }
        </div>

        <div className="h-min gap-5 flex flex-col py-6 px-8 xl:w-xl xl:bg-primary-bg xl:rounded-3xl xl:px-6 xl:py-12 2xl:px-8">
            <div className="flex flex-col items-center gap-1 bg-group-bg rounded-xl overflow-hidden pt-3">
                <h4 className="text-sm text-secondary-color font-extralight">
                    Primary Task
                </h4>

                <Link 
                  to={`/category/${tool?.primaryCategory}`}
                  className="flex items-center gap-2 bg-black-color dark:bg-primary-bg rounded-md px-4 py-1 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-gray-400! text-lg!">
                        signal_cellular_alt
                    </span>
                    <span className="text-white text-sm">{tool?.primaryCategory}</span>
                </Link>

                <span className="w-full py-3 text-xs text-secondary-color text-center font-extralight mt-4 bg-gray-500/40 dark:bg-secondary-bg/30">
                    #1 Most Recent
                </span>
            </div>

            <div
                className="gap-x-1 gap-y-2 flex flex-wrap *:rounded-xl *:px-4 *:py-2 *:text-xs 
                *:text-black-color *:font-extralight *:bg-main-color *:dark:bg-secondary-bg/30 *:dark:text-secondary-color!"
            >
                {
                  tool?.category?.length > 0 && tool?.category?.map((text: ToolCategory, index: number) => (
                    <span key={index}>{text}</span>
                  ))
                }
            </div>

            <p className="text-sm text-secondary-color font-extralight">
                Free + from $20/month
            </p>

            <h5 className="text-secondary-color font-extralight -mb-6">
                Most Popular Alternative:
            </h5>

            {popularAlternative ? (
              <Link 
                to={`/tool/${popularAlternative._id}`}
                className="text-primary-color font-bold underline! underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {popularAlternative.name} ({popularAlternative.totalSaved} saves)
              </Link>
            ) : (
              <h3 className="text-primary-color font-bold underline">
                Loading...
              </h3>
            )}

            <div className="flex flex-col gap-4 [&>button]:flex [&>button]:items-center [&>button]:gap-2 [&>button]:bg-main-color! 
                [&>button]:dark:bg-secondary-bg/30! [&>button]:text-primary-color! [&>button]:dark:text-secondary-color! 
                [&>button]:rounded-xl! [&>button]:px-5! [&>button]:py-3! [&>button]:text-sm! [&>button]:font-medium! dark:[&>button>span]:text-main-color!"
            >
                <button 
                  type="button"
                  onClick={() => navigate(`/category/${tool?.primaryCategory}`)}
                >
                    <span className="material-symbols-outlined">lightbulb_2</span>
                    <h3>
                      {`View${
                        popularAlternative?.totalAlternatives && popularAlternative.totalAlternatives > 1
                          ? ' all'
                          : ''
                      } ${popularAlternative?.totalAlternatives ?? 0} alternatives`}
                    </h3>
                </button>
                <button type="button" >
                    <span className="material-symbols-outlined">toggle_on</span>
                    <h3>Recommendations</h3>
                </button>

            </div>
        </div>
      </main>

      <main className="flex flex-col gap-4 bg-primary-bg px-6 py-15 rounded-3xl">
        <p className="text-sm text-secondary-color font-extralight">{tool.fullDetail}</p>
        <button 
          type="button" 
          onClick={() => window.open(tool?.links.website || '#', '_blank')}
          className="-mb-2 bg-secondary-bg! text-center! py-3!"
        >Visit Website</button>
        <button type="button" className="-mb-2 bg-main-color! text-center! py-3! text-black-color!">Save</button>
      </main>

      <ToolCommunityRatings 
        tool={tool} 
        onToolUpdate={(updatedTool) => setTool(updatedTool)}
      />
    </div>
  );
};

const socialIcons = {
  telegram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-telegram"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
    </svg>
  ),
  X: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-twitter-x"
      viewBox="0 0 16 16"
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  ),
  website: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-globe"
      viewBox="0 0 16 16"
    >
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
    </svg>
  ),
};

export default ToolViewPage;
