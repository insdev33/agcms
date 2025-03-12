import { useState } from "react";
import { Input, Button } from "@/components/ui";
import axios from "axios";

export default function QuotingPlatform() {
    const [formData, setFormData] = useState({
        zip_code: "",
        income: "",
        age: "",
        household_size: "",
        health_conditions: ""
    });
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/get-quotes/", {
                ...formData,
                income: parseFloat(formData.income),
                age: parseInt(formData.age),
                household_size: parseInt(formData.household_size),
                health_conditions: formData.health_conditions.split(",").map(hc => hc.trim())
            });
            setQuotes(response.data);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-xl">
            <h1 className="text-xl font-bold mb-4">Health Insurance Quoting</h1>
            <Input name="zip_code" placeholder="Zip Code" onChange={handleChange} />
            <Input name="income" placeholder="Income" onChange={handleChange} />
            <Input name="age" placeholder="Age" onChange={handleChange} />
            <Input name="household_size" placeholder="Household Size" onChange={handleChange} />
            <Input name="health_conditions" placeholder="Health Conditions (comma-separated)" onChange={handleChange} />
            <Button onClick={fetchQuotes} disabled={loading} className="mt-4">
                {loading ? "Fetching..." : "Get Quotes"}
            </Button>
            <div className="mt-6">
                {quotes.length > 0 ? (
                    <ul>
                        {quotes.map((quote, index) => (
                            <li key={index} className="p-2 border-b">{quote.plan_name} - ${quote.premium}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No quotes found.</p>
                )}
            </div>
        </div>
    );
}
