import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvShow, IGetTvShow } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  background-color: red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 65%;
`;

const Slider = styled(motion.div)`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  font-size: 20px;
  height: 200px;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-radius: 5px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

const BigTv = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  p {
    font-size: 18px;
    margin-bottom: 5px;
    top: -50px;
    position: relative;
  }
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h2`
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  top: -60px;
  padding: 10px;
  text-align: center;
`;

const rowVar = {
  hidden: {
    x: window.outerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 5,
  },
};

const BoxVar = {
  normal: {
    scale: 1,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVar = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Tv() {
  const navigate = useNavigate();
  const tvMatch = useMatch("/tv/:id");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetTvShow>(
    ["tvs", "now_playing"],
    getTvShow
  );
  // const { data: genre, isLoading: gLoading } = useQuery<[IGenre]>(
  //   ["genres"],
  //   getGenres
  // );
  const [pageIndex] = useState(Math.floor(Math.random() * 20));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvShow = data?.results.length;
      const maxIndex = Math.floor(totalTvShow / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const boxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlay = () => navigate("/tv");
  const clickedTv =
    tvMatch?.params.id &&
    data?.results.find((tv) => tv.id + "" === tvMatch.params.id);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(
              data?.results[pageIndex].backdrop_path || ""
            )}
          >
            <Title>{data?.results[pageIndex].name}</Title>
            <Overview>{data?.results[pageIndex].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((prev) => !prev)}
            >
              <Row
                variants={rowVar}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={BoxVar}
                      whileHover="hover"
                      initial="normal"
                      bgphoto={
                        tv.backdrop_path === null
                          ? makeImagePath(tv.poster_path, "w500")
                          : makeImagePath(tv.backdrop_path, "w500")
                      }
                      onClick={() => boxClicked(tv.id)}
                    >
                      <Info variants={infoVar}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {tvMatch ? (
              <>
                <OverLay
                  onClick={onOverlay}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={tvMatch.params.id}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage:
                            clickedTv.backdrop_path === null
                              ? `linear-gradient(to top, black, transparent), url(
                            ${makeImagePath(clickedTv.poster_path, "w500")}
                          )`
                              : `linear-gradient(to top, black, transparent), url(
                            ${makeImagePath(clickedTv.backdrop_path, "w500")}
                          )`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <p>{clickedTv.overview}</p>
                      <p>편성 : {clickedTv.first_air_date}</p>
                      <p>평점 : {clickedTv.vote_average}</p>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
