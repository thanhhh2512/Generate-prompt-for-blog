import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Calendar } from "lucide-react";
import { Layout } from "@/Layout";
import Courses from "./components/courses/Courses";
import Events from "./components/events/Events";
// import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <Layout>
      <div className="container mx-auto">
       
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap size={18} />
                Khóa học
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar size={18} />
                Sự kiện
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="courses" className="mt-0">
            <Courses />
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <Events />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default App;
