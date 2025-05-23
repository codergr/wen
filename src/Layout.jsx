import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCircleInfo, faPaw, faHouse, faBars, faXmark, faPlus, faChartLine, faCopyright, faInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
function Layout() {
    const PAGES = {
        HOME: 'home',
        NEWPET: 'newPet',
        ADD: 'addRecord',
        OVERVIEW: 'recOverview',
        INFO: 'imformation'
    };
    const exportToPDF = () => {
        const input = document.getElementById("reportArea");
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("img/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("WhiskEraNote_Report.pdf");
        })
    }
    const [activePage, setActivePage] = useState(PAGES.HOME);
    const [petName, setPetName] = useState("");
    const [date, setDate] = useState("");
    const [weight, setWeight] = useState(0);
    const [appetite, setAppetite] = useState("");
    const [water, setWater] = useState(0);
    const [sleep, setSleep] = useState("");
    const [note, setNote] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedPet, setSelectedPet] = useState("");
    const [showQuickAddPet, setShowQuickAddPet] = useState(false);
    const [quickPetName, setQuickPetName] = useState("");
    const [quickPetError, setQuickPetError] = useState("");
    const SLEEP_LABELS = {
        aboveTwentyTwo: "22小時（含）以上",
        aboveSixteen: "16小時（含）以上，未滿22小時",
        aboveTwelve: "12小時（含）以上，未滿16小時",
        aboveEight: "8小時（含）以上，未滿12小時",
        belowEight: "少於8小時"
    };
    const APPETITE_LABELS = {
        muchMore: "吃得比平常多很多",
        more: "吃得比平常稍多",
        normal: "食量與平時相當",
        less: "吃得比平常稍少",
        muchLess: "吃得比平常少很多",
        notEating: "未進食"
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!petName || !date || !weight || !appetite || !water || !sleep) {
            setErrorMessage("請填寫所有欄位！（備註除外）");
            setSuccessMessage("");
            return;
        }
        const oldRecords = JSON.parse(localStorage.getItem("records")) ?? [];
        const isDuplicate = oldRecords.some(
            (record) => record.petName === petName && record.date === date
        );
        if (isDuplicate) {
            setErrorMessage(`❌ ${petName} 在 ${date} 已經有紀錄了！請勿重複登錄。`);
            setSuccessMessage("");
            return;
        }
        setErrorMessage("");
        console.log("送出資料：", { petName, date, weight, appetite, water, sleep, symptoms, note });
        const newRecord = { petName, date, weight, appetite, water, sleep, symptoms, note };

        const updatedRecords = [...oldRecords, newRecord];
        updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem("records", JSON.stringify(updatedRecords));
        setPetName("");
        setDate("");
        setWeight(0);
        setAppetite("");
        setWater(0);
        setSleep("");
        setSymptoms([]);
        setNote("");
        setSuccessMessage("✅ 新增成功！");
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };
    const [symptoms, setSymptoms] = useState([]);
    const [records, setRecords] = useState([]);
    useEffect(() => {
        const stored = localStorage.getItem("records");
        if (stored) {
            setRecords(JSON.parse(stored));
        } else {
            setRecords([]);
        }
    }, [activePage]);

    const [pets, setPets] = useState([{ name: "B寶", isDeceased: false }]);
    const [newPet, setNewPet] = useState("");
    const [petError, setPetError] = useState("");
    useEffect(() => {
        const storedPets = localStorage.getItem("pets");
        if (storedPets) {
            setPets(JSON.parse(storedPets));
        }
    }, []);
    const filteredRecords = records.filter(record => record.petName === selectedPet);
    return (
        <div>
            <header className="h-16 px-6 bg-[#e5ece5] flex items-center text-xl font-semibold text-[#2f4f4f]">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="mr-4 text-2xl"
                    title={isSidebarOpen ? "收合側邊欄" : "展開側邊欄"}>
                    {isSidebarOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
                </button>
                WhiskEraNote
            </header>
            <div className="flex">
                <aside className={`${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"} flex flex-col bg-gray-100 h-screen text-lg font-medium transition-all duration-300`}>
                    <div className={`flex items-center py-2 px-4 rounded cursor-pointer transition hover:bg-[#e5ece5] ${activePage === PAGES.HOME ? 'bg-[#d2dcd3] border-l-4 border-[#9daea1] text-[#2f3f33] font-semibold' : 'text-[#3b4a3e]'}`}
                        onClick={() => setActivePage(PAGES.HOME)}>
                        <span><FontAwesomeIcon icon={faHouse} /></span>
                        <span className="ml-2">首頁</span>
                    </div>
                    <div className={`flex items-center py-2 px-4 rounded cursor-pointer transition hover:bg-[#e5ece5] ${activePage === PAGES.NEWPET ? 'bg-[#d2dcd3] border-l-4 border-[#9daea1] text-[#2f3f33] font-semibold' : 'text-[#3b4a3e]'}`}
                        onClick={() => setActivePage(PAGES.NEWPET)}>
                        <span><FontAwesomeIcon icon={faPaw} /></span>
                        <span className="ml-2">寵物管理</span>
                    </div>
                    <div className={`flex items-center py-2 px-4 rounded cursor-pointer transition hover:bg-[#e5ece5] ${activePage === PAGES.ADD ? 'bg-[#d2dcd3] border-l-4 border-[#9daea1] text-[#2f3f33] font-semibold' : 'text-[#3b4a3e]'}`}
                        onClick={() => setActivePage(PAGES.ADD)}>
                        <span><FontAwesomeIcon icon={faPlus} /></span>
                        <span className="ml-2">新增紀錄</span>
                    </div>
                    <div className={`flex items-center py-2 px-4 rounded cursor-pointer transition hover:bg-[#e5ece5] ${activePage === PAGES.OVERVIEW ? 'bg-[#d2dcd3] border-l-4 border-[#9daea1] text-[#2f3f33] font-semibold' : 'text-[#3b4a3e]'}`}
                        onClick={() => setActivePage(PAGES.OVERVIEW)}>
                        <span><FontAwesomeIcon icon={faClipboardList} /></span>
                        <span className="ml-2">紀錄總覽</span>
                    </div>
                    <div className={`flex items-center py-2 px-4 rounded cursor-pointer transition hover:bg-[#e5ece5] ${activePage === PAGES.INFO ? 'bg-[#d2dcd3] border-l-4 border-[#9daea1] text-[#2f3f33] font-semibold' : 'text-[#3b4a3e]'}`}
                        onClick={() => setActivePage(PAGES.INFO)}>
                        <span><FontAwesomeIcon icon={faCircleInfo} /></span>
                        <span className="ml-2">關於專案</span>
                    </div>
                </aside>
                <main className={`flex-1 p-6 bg-[#fffdf5] overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-0"}`}>
                    {activePage === PAGES.HOME && ( // Only when the condition is met, the following code will be exe. 
                        <div>
                            <h1 className='text-2xl font-bold mb-2'>歡迎光臨 WhiskEraNote!</h1>
                            <p>點選左列選單以選取您要操作的功能！</p>
                            {/* <ul className="text-red-500 font-bold">初次使用請先至<button className="bg-[#9daea1] text-white px-2 py-25 rounded hover:bg-[#7f9184] transition" onClick={() => setActivePage(PAGES.NEWPET)}>🐈 寵物管理</button>新增您的寵物</ul> */}
                            <div id="reportArea">
                                <div className="mt-6">
                                    <h2 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faChartLine} /> 報表</h2>
                                    <select
                                        value={selectedPet}
                                        onChange={(e) => setSelectedPet(e.target.value)}
                                        className="border p-2 rounded mb-4">
                                        <option value="">請選擇寵物</option>
                                        {
                                            pets.map((pet) => (
                                                <option key={pet.name} value={pet.name}>{pet.name}</option>
                                            ))
                                        }
                                    </select>
                                    {selectedPet && filteredRecords.length > 0 ? (
                                        <div className="flex space-x-4">
                                            <ResponsiveContainer width="50%" height={300}>
                                                <LineChart data={[...filteredRecords].reverse()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="linear" dataKey="water" stroke="#8884d8" isAnimationActive={false} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                            <ResponsiveContainer width="50%" height={300}>
                                                <LineChart data={[...filteredRecords].reverse()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="linear" dataKey="weight" stroke="#82ca9d" isAnimationActive={false} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>

                                        </div>
                                    ) : (
                                        <p className="text-gray-500">請先選擇寵物，或目前暫無紀錄</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activePage === PAGES.NEWPET && ( // Only when the condition is met, the following code will be exe. 
                        <div>
                            <h1 className='text-2xl font-bold mb-2'>寵物管理</h1>
                            <div className="space-y-2 mb-4">
                                <h2 className="text-lg font-bold text-gray-800">註冊新寵物</h2>
                                <div className="flex space-x-2">
                                    <input type="text"
                                        value={newPet}
                                        onChange={(e) => setNewPet(e.target.value)}
                                        placeholder="輸入寵物名字"
                                        className="border p-2 rounded w-64"
                                    />
                                    <button type="button" className="bg-[#9daea1] text-white px-4 py-25 rounded hover:bg-[#7f9184] transition"
                                        onClick={() => {
                                            const trimmed = newPet.trim();
                                            if (!trimmed) {
                                                setPetError("請輸入寵物名字！");
                                            } else if (pets.some(p => p.name === trimmed)) {
                                                setPetError("這隻寵物已註冊！");
                                            } else {
                                                const updatedPets = [...pets, { name: trimmed, isDeceased: false }];
                                                setPets(updatedPets);
                                                localStorage.setItem("pets", JSON.stringify(updatedPets));
                                                setNewPet("");
                                                setPetError("");
                                            }
                                        }}
                                    >
                                        新增
                                    </button>
                                </div>
                                {petError && <p className="text-red-500 text-sm">{petError}</p>}
                            </div>
                            <div className="space-y-2">
                                {pets.map((pet, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded shadow">
                                        <span className={`mr-2 ${pet.isDeceased ? "text-gray-400" : "text-black"}`}>
                                            {pet.name}{pet.isDeceased ? "（歿）" : ""}
                                        </span>
                                        <div className="space-x-2">
                                            {!pet.isDeceased && (
                                                <button className="text-blue-600 hover:underline"
                                                    onClick={() => {
                                                        if (window.confirm(`確定要將${pet.name}標記為「歿」嗎？`)) {
                                                            const updatedPets = pets.map(p =>
                                                                p.name === pet.name ? { ...p, isDeceased: true } : p
                                                            );
                                                            setPets(updatedPets);
                                                            localStorage.setItem("pets", JSON.stringify(updatedPets));
                                                        }
                                                    }}>
                                                    【歿】
                                                </button>
                                            )}
                                            <button className="text-red-600 hover:underline"
                                                onClick={() => {
                                                    if (window.confirm(`確定要刪除${pet.name}嗎？刪除後將無法回復`)) {
                                                        const updatedPets = pets.filter(p => p.name !== pet.name);
                                                        setPets(updatedPets);
                                                        localStorage.setItem("pets", JSON.stringify(updatedPets));
                                                    }
                                                }}
                                            >
                                                【刪除】
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activePage === PAGES.ADD && ( // Only when the condition is met, the following code will be exe. 
                        <div>
                            <h1 className='text-2xl font-bold mb-2'>新增紀錄</h1>
                            <form className="space-y-4 max-w-xl bg-[#f9f5e9] p-6 rounded shadow-md" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="nameOfPet" className="block font-bold mb-1 text-gray-700">寵物名字</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickAddPet(!showQuickAddPet)}
                                        className="text-sm text-blue-600 hover:underline mt-1"
                                    >
                                        <FontAwesomeIcon icon={showQuickAddPet ? faXmark : faPenToSquare} />
                                        <span>{showQuickAddPet ? "取消新增" : "新增寵物"}</span>
                                    </button>
                                    {showQuickAddPet && (
                                        <div className="mt-2 flex items-conter space-x-2">
                                            <input
                                                type="text"
                                                placeholder="輸入寵物名字"
                                                value={quickPetName}
                                                onChange={(e) => setQuickPetName(e.target.value)}
                                                className="border p-2 rounded w-64"
                                            />
                                            <button
                                            type="button"
                                            className="bg-[#9daea1] text-white px-4 py-2 rounded hover:bg-[#7f9184] transition"
                                            onClick={()=>{
                                                const trimmed=quickPetName.trim();
                                                if(!trimmed){
                                                    setQuickPetError("請輸入寵物名字！")
                                                } else if (pets.some(p=>p.name===trimmed)){
                                                    setQuickPetError("這隻寵物已註冊！");
                                                }else{
                                                    const updatedPets=[...pets,{name:trimmed, isDeceased:false}];
                                                    setPets(updatedPets);
                                                    localStorage.setItem("pets",JSON.stringify(updatedPets));
                                                    setPetName(trimmed);
                                                    setQuickPetName("");
                                                    setQuickPetError("");
                                                    setShowQuickAddPet(false);
                                                }
                                            }}
                                            >
                                                新增
                                            </button>
                                        </div>
                                    )}
                                    {quickPetError&&<p className="text-red-600 text-sm">{quickPetError}</p>}
                                    <select id="nameOfPet" className="border p-2 w-full rounded" value={petName} onChange={(e) => setPetName(e.target.value)}>
                                        <option value="">請選擇</option>
                                        {pets.map((pet) => (
                                            <option key={pet.name} value={pet.name} disabled={pet.isDeceased}>{pet.name}{pet.isDeceased ? "（歿）" : ""}</option>
                                        ))}
                                    </select>
                                    
                                </div>
                                <div>
                                    <label htmlFor="date" className="block font-bold mb-1 text-gray-700">日期</label>
                                    <input id="date" type="date" className="border p-2 w-40 rounded" value={date} max={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)}></input>
                                </div>
                                <div>
                                    <label htmlFor="weight" className="block font-bold mb-1 text-gray-700">體重</label>
                                    <div className="flex item-center space-x-2">
                                        <input id="weight" type="number" min="0" step="0.01" className="border p-2 w-32 rounded" value={weight}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const cleaned = value.replace(/^0+(?=\d)/, "");
                                                setWeight(cleaned);
                                            }}></input>
                                        <span className="text-gray-700">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="appetite" className="block font-bold mb-1 text-gray-700">食慾</label>
                                    <select id="appetite" className="border p-2 w-full rounded" value={appetite} onChange={(e) => setAppetite(e.target.value)}>
                                        <option value="">請選擇</option>
                                        <option value="muchMore">吃得比平常多很多</option>
                                        <option value="more">吃得比平常稍多</option>
                                        <option value="normal">食量與平時相當</option>
                                        <option value="less">吃得比平常稍少</option>
                                        <option value="muchLess">吃得比平常少很多</option>
                                        <option value="notEating">未進食</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="water" className="block font-bold mb-1 text-gray-700">飲水</label>
                                    <div className="flex item-center space-x-2">
                                        <input id="water" type="number" min="0" step="0.1" className="border p-2 w-32 rounded" value={water} onChange={(e) => {
                                            const value = e.target.value;
                                            const cleaned = value.replace(/^0+(?=\d)/, "");
                                            setWater(cleaned);
                                        }}></input>
                                        <span className="text-gray-700">ml</span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="sleep" className="block font-bold mb-1 text-gray-700">睡眠</label>
                                    <select id="sleep" className="border p-2 w-full rounded" value={sleep} onChange={(e) => setSleep(e.target.value)}>
                                        <option value="">請選擇</option>
                                        <option value="aboveTwentyTwo">22小時（含）以上</option>
                                        <option value="aboveSixteen">16小時（含）以上，未滿22小時</option>
                                        <option value="aboveTwelve">12小時（含）以上，未滿16小時</option>
                                        <option value="aboveEight">8小時（含）以上，未滿12小時</option>
                                        <option value="belowEight">少於8小時</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="block font-bold mb-1 text-gray-700">不適</p>
                                    <div className="space-y-2">
                                        {["嘔吐Vomit", "暈眩Dizzy", "鼻涕Running nose", "腹瀉Diarrhea", "流口水Drooling", "精神不濟Mental fatigue", "嗜睡Lethargy"].map((symptom) => (
                                            <label key={symptom} className="flex items-center space-x-2">
                                                <input type="checkbox" checked={symptoms.includes(symptom)} onChange={() => {
                                                    if (symptoms.includes(symptom)) {
                                                        setSymptoms(symptoms.filter(item => item !== symptom));
                                                    } else {
                                                        setSymptoms([...symptoms, symptom]);
                                                    }
                                                }}
                                                />
                                                <span>{symptom}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="note" className="block font-bold mb-1 text-gray-700">備註</label>
                                    <textarea id="note" rows="3" className="border p-2 w-full rounded" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                </div>
                                <div className="flex items-center justify-end space-x-4">
                                    {
                                        errorMessage && (
                                            <span className="text-red-600 text-sm">{errorMessage}</span>
                                        )
                                    }
                                    {
                                        successMessage && (
                                            <span className="text-green-600 text-sm">{successMessage}</span>
                                        )
                                    }
                                    <button type="submit" className="bg-[#9daea1] text-white px-4 py-2 rounded hover:bg-[#7f9184] transition">新增</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activePage === PAGES.OVERVIEW && ( // Only when the condition is met, the following code will be exe. 
                        <div>
                            <h1 className='text-2xl font-bold mb-2'>紀錄總覽</h1>
                            {records.length === 0 ? (<p>尚未新增任何資料</p>) : (
                                <div className="space-y-4">
                                    {records.map((record, index) => (
                                        <div key={index} className="relative border rounded p-4 shadow bg-white">
                                            <button className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
                                                onClick={() => {
                                                    if (window.confirm("確定要刪除這筆紀錄嗎？紀錄刪除後將無法回復")) {
                                                        const updated = records.filter((_, i) => i !== index);
                                                        setRecords(updated);
                                                        localStorage.setItem("records", JSON.stringify(updated));
                                                    }
                                                }}>
                                                【刪除】
                                            </button>
                                            <p><strong>🐾 寵物：</strong>{record.petName}</p>
                                            <p><strong>📅 日期：</strong>{record.date}</p>
                                            <p><strong>⚖️ 體重：</strong>{record.weight} kg</p>
                                            <p><strong>🍽️ 食慾：</strong>{APPETITE_LABELS[record.appetite]}</p>
                                            <p><strong>💧 飲水：</strong>{record.water} ml</p>
                                            <p><strong>🛌 睡眠：</strong>{SLEEP_LABELS[record.sleep]}</p>
                                            <p><strong>😿 不適：</strong>{record.symptoms.join("、")}</p>
                                            <p><strong>📝 備註：</strong>{record.note}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {activePage === PAGES.INFO && (
                        <div>
                            <div className="bg-gray-100 border border-gray-500 rounded-xl px-4 py-2">
                                <h2 className="font-bold text-xl"><FontAwesomeIcon icon={faInfo} />&nbsp;WhiskEraNote是甚麼？</h2>
                                WhiskEraNote是一旨在讓寵物主人可以輕鬆、毫無負擔地紀錄寵物健康狀況的專案，不需要雲端、不用帳號登入，資料存在自己的裝置，
                                安心又便利，陪你一起守護毛孩的每一天。
                            </div>

                            <div className="mt-4 bg-gray-100 border border-gray-500 rounded-xl px-4 py-2">
                                Icon by Font Awesome, distributed under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" className="text-green-600 underline underline-dotted decoration-pink-400 hover:text-green-800">Creative Commons Attribution 4.0 International License</a>.
                            </div>
                            
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
export default Layout;