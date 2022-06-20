import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate, useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IDetailMovie, ISearch } from "../api";
import { makeImagePath } from "../utils";

const SearchText = styled.h1`
  margin-top: 300px;
  margin-bottom: 100px;
  color: white;
  font-size: 36px;
`;

const Loader = styled.div`
  height: 20vh;
`;

const Slider = styled(motion.div)`
  position: relative;
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

function Search() {
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [leaving, setLeaving] = useState(false);
  const { data, isLoading } = useQuery<ISearch>(["movies", "now_playing"], () =>
    getSearch(keyword as any)
  );
  const totalMovie = data?.results.length;
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const maxIndex = Math.floor((totalMovie as any) / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <SearchText>당신이 입력한 검색어 : {keyword}</SearchText>
          <Slider>
            <AnimatePresence initial={false}>
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
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={BoxVar}
                      whileHover="hover"
                      initial="normal"
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </>
  );
}
export default Search;
