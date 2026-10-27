import { mutationFn } from "@/utils";

interface IHandleLikeProduct {
  userId: string;
  isLiked: boolean;
  productId: string;
  onToggleLike: () => void;
}

export const handleLikeProduct = (props: IHandleLikeProduct) => {
  const { onToggleLike, isLiked, productId, userId } = props;
  onToggleLike();
  mutationFn({
    url: isLiked ? `/likes/${productId}` : "/likes",
    method: isLiked ? "DELETE" : "POST",
    data: isLiked
      ? {}
      : {
          productId,
          userId,
        },
  }).catch(onToggleLike);
};
