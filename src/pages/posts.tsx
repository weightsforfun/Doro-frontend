import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Post } from "../components/post";
import {
  postsPageQuery,
  postsPageQueryVariables,
} from "../__generated__/postsPageQuery";

const POSTS_QUERY = gql`
  query postsPageQuery($input: FindAllPostsInput!) {
    findAllPosts(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        createdAt
        title
        ownerName
        id
      }
    }
  }
`;

interface IFormProps {
  page: number;
}

export const Posts = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<postsPageQuery, postsPageQueryVariables>(
    POSTS_QUERY,
    { variables: { input: { page } } }
  );
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onFirstPageClick = () => setPage((current) => 1);
  const onLastPageClick = () =>
    setPage((current) =>
      data?.findAllPosts.totalPages ? data?.findAllPosts.totalPages : 1
    );
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const navigate = useNavigate();
  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
          <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
            {data?.findAllPosts.results?.map((post, index) => (
              <>
                <Post
                  key={post.id}
                  num={
                    data.findAllPosts.totalResults
                      ? data.findAllPosts.totalResults - index - (page - 1) * 5
                      : +""
                  }
                  id={post.id}
                  ownerName={post.ownerName}
                  title={post.title}
                  createdAt={post.createdAt}
                />
                <hr className=" w-2/5" />
              </>
            ))}
          </div>
          <div>
            <button
              onClick={onFirstPageClick}
              className="focus:outline-none font-medium text-2xl"
              disabled={page > 1 ? false : true}
            >
              &laquo;
            </button>
            <button
              onClick={onPrevPageClick}
              className="focus:outline-none font-medium text-2xl"
              disabled={page > 1 ? false : true}
            >
              &lsaquo;
            </button>
            <span>{page}</span>
            <button
              onClick={onNextPageClick}
              className="focus:outline-none font-medium text-2xl"
              disabled={page !== data?.findAllPosts.totalPages ? false : true}
            >
              &rsaquo;
            </button>
            <button
              onClick={onLastPageClick}
              className="focus:outline-none font-medium text-2xl"
              disabled={page !== data?.findAllPosts.totalPages ? false : true}
            >
              &raquo;
            </button>
          </div>
          <Button
            canClick={true}
            loading={false}
            actionText={"교육 문의하기"}
          />
        </div>
      )}
    </div>
  );
};
