import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";

export default function LecturerDashboard() {
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [qrData, setQrData] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);

  const { user } = useAuth();
 

  const collegesWithSchools = {
    "College of Science and Technology (CST)": [
      "School of Engineering",
      "School of Science",
      "School of Architecture and Built Environment",
    ],
    "College of Business and Economics (CBE)": [
      "School of Business",
      "School of Economics",
    ],
  };

  const schoolsWithDepartments = {
    "School of Engineering": [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
    ],
    "School of Science": ["Physics", "Chemistry", "Biology"],
    "School of Architecture and Built Environment": [
      "Urban Planning",
      "Architecture",
      "Construction Management",
    ],
    "School of Business": ["Accounting", "Marketing", "Management"],
    "School of Economics": ["Microeconomics", "Macroeconomics"],
  };

  const departmentsWithClasses = {
    "Civil Engineering": ["level1", "level2", "level3"],
    "Mechanical Engineering": ["level1", "level2"],
    Physics: ["level1", "level2"],
    Accounting: ["level1", "level2"],
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollege(e.target.value);
    setSelectedSchool("");
    setSelectedDepartment("");
    setSelectedClass("");
    setQrData(""); 
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(e.target.value);
    setSelectedDepartment("");
    setSelectedClass("");
    setQrData(""); // Reset QR code data
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setSelectedClass("");
    setQrData(""); // Reset QR code data
  };
const attendenceOwner=localStorage.getItem('token')
  const handleSubmit = () => {
    const data = {
      attendenceOwner:attendenceOwner,
      College: selectedCollege,
      School: selectedSchool,
      Department: selectedDepartment,
      Class: selectedClass,
      module:selectedModule,
    };
    setQrData(JSON.stringify(data));
    setShowForm(false); 
  };
  console.log(qrData,'data from qr code')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {user?.firstName}
      </h1>

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select College
            </label>
            <select
              value={selectedCollege}
              onChange={handleCollegeChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a College
              </option>
              {Object.keys(collegesWithSchools).map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </select>

            {selectedCollege && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select School
                </label>
                <select
                  value={selectedSchool}
                  onChange={handleSchoolChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a School
                  </option>
                  {collegesWithSchools[
                    selectedCollege as keyof typeof collegesWithSchools
                  ].map((school, index) => (
                    <option key={index} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedSchool && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a Department
                  </option>
                  {schoolsWithDepartments[
                    selectedSchool as keyof typeof schoolsWithDepartments
                  ].map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedDepartment && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a Class
                  </option>
                  {departmentsWithClasses[
                    selectedDepartment as keyof typeof departmentsWithClasses
                  ].map((cls, index) => (
                    <option key={index} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                Enter Module Name
              </label>
              <input
                type="text"
                placeholder="Enter module name"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              />
              </>
            )}

            {selectedClass && (
              <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Generate Qr code
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[70vh]">
          <div>
            <h2 className="text-lg font-bold text-center">Generated QR Code</h2>
            <QRCodeCanvas value={qrData} size={300} />
          </div>
        </div>
      )}
    </div>
  );
}
