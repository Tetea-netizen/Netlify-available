
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const CreatorFinanceDashboard = () => {
  const [data, setData] = useState(null);
  const [rate, setRate] = useState('');
  const [methods, setMethods] = useState('');

  useEffect(() => {
    axios.get('/api/creator/finance/dashboard').then(res => {
      setData(res.data);
      setRate(res.data.exchangeRate);
      setMethods(res.data.supportedMethods.join(','));
    });
  }, []);

  const updateRate = () => {
    axios.post('/api/creator/finance/exchange-rate', { rate }).then(() => alert('Updated'));
  };

  const updateMethods = () => {
    axios.post('/api/creator/finance/payout-methods', {
      methods: methods.split(',').map(m => m.trim()),
    }).then(() => alert('Methods Updated'));
  };

  const handleWithdrawal = (id, action) => {
    axios.post(`/api/creator/finance/withdrawals/${id}/${action}`).then(() => {
      alert(`Withdrawal ${action}`);
      window.location.reload();
    });
  };

  const updateSalary = (id, updates) => {
    axios.post(`/api/creator/finance/salaries/${id}`, updates).then(() => {
      alert('Salary Updated');
      window.location.reload();
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Creator Financial Dashboard</h1>
      <Tabs defaultValue="exchange">
        <TabsList>
          <TabsTrigger value="exchange">Exchange</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="salaries">Admin Salaries</TabsTrigger>
        </TabsList>

        <TabsContent value="exchange">
          <Card>
            <CardContent>
              <h2 className="text-xl font-bold mb-2">Exchange Rate</h2>
              <Input value={rate} onChange={e => setRate(e.target.value)} />
              <Button className="mt-2" onClick={updateRate}>Update Rate</Button>

              <h2 className="text-xl font-bold mt-6 mb-2">Payout Methods</h2>
              <Input value={methods} onChange={e => setMethods(e.target.value)} />
              <Button className="mt-2" onClick={updateMethods}>Update Methods</Button>

              <h2 className="text-lg font-bold mt-6">Total Earnings: ${data.earnings}</h2>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          {data.withdrawals.map(w => (
            <Card key={w.id} className="my-2">
              <CardContent>
                <p>User: {w.user}</p>
                <p>Amount: {w.amount}</p>
                <p>Method: {w.method}</p>
                <p>Status: {w.status}</p>
                {w.status === 'pending' && (
                  <div className="space-x-2 mt-2">
                    <Button onClick={() => handleWithdrawal(w.id, 'approved')}>Approve</Button>
                    <Button onClick={() => handleWithdrawal(w.id, 'declined')}>Decline</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="salaries">
          {data.adminSalaries.map(a => (
            <Card key={a.id} className="my-2">
              <CardContent>
                <p>Name: {a.name}</p>
                <p>Salary: ${a.salary}</p>
                <Input placeholder="New Salary" onBlur={e => updateSalary(a.id, { salary: e.target.value })} />
                <Input placeholder="Penalty" onBlur={e => updateSalary(a.id, { penalty: e.target.value })} />
                <Input placeholder="Bonus" onBlur={e => updateSalary(a.id, { bonus: e.target.value })} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorFinanceDashboard;
