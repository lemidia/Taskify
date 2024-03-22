import { Sidebar } from "../_components/sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto h-full">
      <div className="flex gap-x-5">
        <div className="pt-24 h-screen sticky top-0">
          <div className="w-64 shrink-0 hidden md:block self-start overflow-y-scroll h-full pr-2 ">
            <Sidebar />
          </div>
        </div>
        <div className="w-full h-full pt-20 md:pt-24">{children}</div>
      </div>
    </main>
  );
};

export default OrganizationLayout;
