export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(res.statusText || "Network response was not ok");
  }
  return res.json();
};
