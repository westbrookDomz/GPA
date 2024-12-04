export default function CustomError({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {statusCode ? `Error ${statusCode}` : "An error occurred"}
        </h1>
        <p className="text-gray-600">Sorry, something went wrong.</p>
      </div>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
