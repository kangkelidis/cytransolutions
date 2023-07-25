import IncomeDisplay from "../db/components/IncomeDisplay";
import NewRideBtn from "../components/NewRideBtn";

const Dashboard = () => {

  return (
    <main>
      <h1>DASHBOARD</h1>
      <NewRideBtn />
      <div className="p-4">
        <IncomeDisplay />
      </div>
    </main>
  );
};

export default Dashboard;
