'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CPL_DATA } from '@/lib/cpldata'
import Navbar from '@/components/Navbar'

// ─── Season 4 Player List ────────────────────────────────────────────────────
const S4_PLAYERS = [
    { name: "Dhriti Darji", tshirt: "DHRITI", category: "Player", gender: "Female", age: "6-10 years" },
    { name: "Vrusha Ashish Mehta", tshirt: "VRUSHA", category: "Player", gender: "Female", age: "6-10 years" },
    { name: "Aarna Patel", tshirt: "AARNA", category: "Player", gender: "Female", age: "6-10 years" },
    { name: "Naiya Singh", tshirt: "NAIYA", category: "Player", gender: "Female", age: "6-10 years" },
    { name: "Bhavi", tshirt: "Bhavi", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Darshna Saglani", tshirt: "Darshna", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Dhun Bhardwaj", tshirt: "DHUN", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Jianna JayRaj", tshirt: "Jianna", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Khyati Sevak", tshirt: "Khyati", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Kruti", tshirt: "Kruti", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Mishika Thakker", tshirt: "MISHIKA", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Payal Thakker", tshirt: "PAYAL", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Hetal P", tshirt: "HETAL", category: "Player", gender: "Female", age: "Above 10 years" },
    { name: "Mitanshu Patel", tshirt: "MITANSHU", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Aarav Patel", tshirt: "AARAV", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Avyukt Sule", tshirt: "Avyukt Sule", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Hridaan Vyas", tshirt: "Hridaan Vyas", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Ishan Patel", tshirt: "ISHU 67", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Mukul Goyal", tshirt: "Riyaarth", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Dhritya Agarwal", tshirt: "DHRITYA", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Pranshul Dave", tshirt: "PRANSHUL", category: "Player", gender: "Male", age: "6-10 years" },
    { name: "Abhay Vaidya", tshirt: "Capt Abhay", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Aditya Gupta", tshirt: "ADITYA", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Abhishek Pathania", tshirt: "PATS", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Abhyoday Ranjan", tshirt: "Abby 18", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Adarsh Verma", tshirt: "ADARSH", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Ajendrasinh Rathod", tshirt: "AJENDRASINH", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Alok Ratre", tshirt: "ALOK", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Amey Sule", tshirt: "Amey Sule", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Anand Pratap", tshirt: "Rana", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Ankur Prajapati", tshirt: "Ankur", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Arnav Singh Pathania", tshirt: "Arnav Pathania", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Arpit Patel", tshirt: "AP", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Ashok", tshirt: "Ashok", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Atharv Parashar", tshirt: "Atharv", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Ayan Ratre", tshirt: "AYAN", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Bharat Chaudhary", tshirt: "CHAUDHARY", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Bhavya", tshirt: "Bhavya", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Chandresh Thakkar", tshirt: "CHANDRESH", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Dhaval Savaliya", tshirt: "Dhaval", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Dhruvam", tshirt: "Mehta", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Dr. Apurva Gupta", tshirt: "Apurva", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Hardik Modi", tshirt: "HARDIK", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Harish Karnik", tshirt: "HARISH", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Harpalsinh Jadeja", tshirt: "HRJ", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Hawan Chouhan", tshirt: "Hawan", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jaimin Patel", tshirt: "Jaimin", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jainil Patel", tshirt: "JAINIL 18", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jaival Pandya", tshirt: "Jaival", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jasvantsinh Gohil", tshirt: "GOHIL", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "JayRaj Lukose", tshirt: "JayRaj Lukose", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jayrajsinh Gohil", tshirt: "Jayrajsinh", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jigar Thakker", tshirt: "JIGAR", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Karan Saglani", tshirt: "Karan", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Ketan Dave", tshirt: "Dave", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Kiransinh Rathod", tshirt: "Rathod", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Kunjan Patel", tshirt: "Kunjan", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Maalavsinh Gohil", tshirt: "Maalavsinh", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Madhav", tshirt: "M M", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Manan Shah", tshirt: "Manan", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Manas", tshirt: "Manny", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Mann Bhavsar", tshirt: "ITS MANN", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Mann Patel", tshirt: "Mann", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Manthan Prajapati", tshirt: "Manthan", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Medhansh Parekh", tshirt: "Medhansh", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Mehul Sohani", tshirt: "MEHUL", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Mihir Dalia", tshirt: "Mihir", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Mithil Parekh", tshirt: "Mithil", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Narendra Bhardwaj", tshirt: "NARENDRA", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Neelmadhavsinh Jadeja", tshirt: "NHJ", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Nikunj Patel", tshirt: "Nikunj", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Praful G Trivedi", tshirt: "Pintu -17", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Pranav Sheth", tshirt: "SHETH", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Pranay Darji", tshirt: "PRANAY", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Prashant Bhavsar", tshirt: "Pointy", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Pratik", tshirt: "Pratik 03", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Rahil Saglani", tshirt: "RAHIL", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Raj Shah", tshirt: "Raj", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Rakshit P Trivedi", tshirt: "Rakshit 03", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Raviraj Parmar", tshirt: "Raviraj", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Rishi Saglani", tshirt: "RISHI", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Rushi Darji", tshirt: "RUSHI", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Rutuj", tshirt: "Rutuj", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Shaurin Patel", tshirt: "VEXMA", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Shlok Bhavsar", tshirt: "Shloky", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Smit Patel", tshirt: "SMIT", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Tirth Patel", tshirt: "Tirth", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Umesh Tiwari", tshirt: "Umesh", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Vaibhav Singh", tshirt: "Vasu", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Vatsal Shah", tshirt: "Vatsal", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Vihaan Dalia", tshirt: "Dalia", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Viral Sevak", tshirt: "Viral", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Yash Dalia", tshirt: "Yash", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Yashrajsinh Gohil", tshirt: "yashrajsinh", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Dhyey Patel", tshirt: "Dhyey", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Dr Nisarg Savjiani", tshirt: "NISARG", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Hitansh Shah", tshirt: "Hitansh Shah", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jignesh Shah", tshirt: "Jignesh Shah", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Malav Agarwal", tshirt: "MALAV", category: "Player", gender: "Male", age: "Above 10 years" },
    { name: "Jitendrasinh Gohil", tshirt: "Jitendrasinh", category: "Player", gender: "Male", age: "Above 10 years" },
]

// ─── Styles ──────────────────────────────────────────────────────────────────
const TAB_BTN = (active) => ({
  padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
  fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', letterSpacing: '1px',
  border: active ? 'none' : `1px solid rgba(0,212,255,0.2)`,
  background: active ? '#CC2200' : 'transparent',
  color: active ? '#fff' : '#8899CC',
  transition: 'all 0.15s'
})

const S4_TAB_BTN = (active) => ({
  padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
  fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', letterSpacing: '1px',
  border: active ? 'none' : `1px solid rgba(255,215,0,0.4)`,
  background: active ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,215,0,0.06)',
  color: active ? '#0A0E2A' : '#FFD700',
  transition: 'all 0.15s',
  boxShadow: active ? '0 0 16px rgba(255,215,0,0.4)' : 'none',
})

const TH = ({ children, left }) => (
  <th style={{
    padding: '12px 12px', color: '#8899CC', fontWeight: '700',
    letterSpacing: '1px', fontSize: '11px',
    textAlign: left ? 'left' : 'center',
    whiteSpace: 'nowrap', position: 'sticky', top: 0,
    background: '#0a1030', borderBottom: '2px solid #00D4FF',
    zIndex: 2
  }}>{children}</th>
)

// ─── Stats Tables ─────────────────────────────────────────────────────────────
function MvpTable({ data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          <TH>#</TH><TH>Rank</TH><TH left>Player</TH><TH left>Team</TH>
          <TH>Mat</TH><TH>Total</TH><TH>Bat</TH><TH>Bowl</TH><TH>Field</TH>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid rgba(0,212,255,0.07)', background: i%2===0?'rgba(0,212,255,0.02)':'transparent' }}>
            <td style={{padding:'9px 12px',color:'rgba(0,212,255,0.4)',textAlign:'center',fontSize:'12px'}}>{i+1}</td>
            <td style={{padding:'9px 12px',color:r.Rank!=='-'?'#00D4FF':'#8899CC',fontWeight:'700',textAlign:'center'}}>{r.Rank}</td>
            <td style={{padding:'9px 12px',color:'#fff',fontWeight:'600',whiteSpace:'nowrap'}}>{r['Player Name']}</td>
            <td style={{padding:'9px 12px',color:'#8899CC',fontSize:'12px',whiteSpace:'nowrap'}}>{r['Team Name']}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Mat}</td>
            <td style={{padding:'9px 12px',color:'#FFA500',fontWeight:'700',textAlign:'center'}}>{r.Total?.toFixed(2)}</td>
            <td style={{padding:'9px 12px',color:'#00D4FF',textAlign:'center'}}>{r.Batting?.toFixed(2)}</td>
            <td style={{padding:'9px 12px',color:'#FF6B6B',textAlign:'center'}}>{r.Bowling?.toFixed(2)}</td>
            <td style={{padding:'9px 12px',color:'#90EE90',textAlign:'center'}}>{r.Fielding?.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BatTable({ data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          <TH>Rank</TH><TH left>Player</TH><TH left>Team</TH>
          <TH>Mat</TH><TH>Inns</TH><TH>Runs</TH><TH>Balls</TH><TH>HS</TH>
          <TH>N/O</TH><TH>Avg</TH><TH>SR</TH><TH>4s</TH><TH>6s</TH><TH>50s</TH><TH>100s</TH>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid rgba(0,212,255,0.07)', background: i%2===0?'rgba(0,212,255,0.02)':'transparent' }}>
            <td style={{padding:'9px 12px',color:'#00D4FF',fontWeight:'700',textAlign:'center'}}>{r.Rank}</td>
            <td style={{padding:'9px 12px',color:'#fff',fontWeight:'600',whiteSpace:'nowrap'}}>{r['Player Name']}</td>
            <td style={{padding:'9px 12px',color:'#8899CC',fontSize:'12px',whiteSpace:'nowrap'}}>{r['Team Name']}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Mat}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Inns}</td>
            <td style={{padding:'9px 12px',color:'#FFA500',fontWeight:'700',textAlign:'center'}}>{r.Runs}</td>
            <td style={{padding:'9px 12px',color:'#8899CC',textAlign:'center'}}>{r.Balls}</td>
            <td style={{padding:'9px 12px',color:'#FF6B6B',fontWeight:'700',textAlign:'center'}}>{r.Highest}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r['N/O']}</td>
            <td style={{padding:'9px 12px',color:'#00D4FF',fontWeight:'700',textAlign:'center'}}>{r.Avg}</td>
            <td style={{padding:'9px 12px',color:'#FF6B6B',fontWeight:'700',textAlign:'center'}}>{r.SR}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r['4s']}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r['6s']}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r['50s']}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r['100s']}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BowlTable({ data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          <TH>Rank</TH><TH left>Player</TH><TH left>Team</TH><TH left>Style</TH>
          <TH>Mat</TH><TH>Inns</TH><TH>Overs</TH><TH>Runs</TH><TH>Wkts</TH>
          <TH>Best</TH><TH>Mdns</TH><TH>Avg</TH><TH>Econ</TH><TH>SR</TH>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid rgba(0,212,255,0.07)', background: i%2===0?'rgba(0,212,255,0.02)':'transparent' }}>
            <td style={{padding:'9px 12px',color:'#00D4FF',fontWeight:'700',textAlign:'center'}}>{r.Rank}</td>
            <td style={{padding:'9px 12px',color:'#fff',fontWeight:'600',whiteSpace:'nowrap'}}>{r['Player Name']}</td>
            <td style={{padding:'9px 12px',color:'#8899CC',fontSize:'12px',whiteSpace:'nowrap'}}>{r['Team Name']}</td>
            <td style={{padding:'9px 12px',color:'#8899CC',fontSize:'11px',whiteSpace:'nowrap'}}>{r['Bowling Style']&&r['Bowling Style']!=='-'?r['Bowling Style']:'—'}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Mat}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Inns}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Overs}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Runs}</td>
            <td style={{padding:'9px 12px',color:'#FFA500',fontWeight:'700',textAlign:'center'}}>{r.Wickets}</td>
            <td style={{padding:'9px 12px',color:'#FF6B6B',textAlign:'center'}}>{r.Highest}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.Maidens}</td>
            <td style={{padding:'9px 12px',color:'#00D4FF',fontWeight:'700',textAlign:'center'}}>{r.Avg}</td>
            <td style={{padding:'9px 12px',color:'#90EE90',fontWeight:'700',textAlign:'center'}}>{r.Econ}</td>
            <td style={{padding:'9px 12px',color:'#fff',textAlign:'center'}}>{r.SR}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Season 4 Roster ──────────────────────────────────────────────────────────
function S4RosterCard({ player, index }) {
  return (
    <div style={{
      background: 'rgba(0,212,255,0.04)',
      border: '1px solid rgba(0,212,255,0.12)',
      borderRadius: '10px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        minWidth: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(0,212,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: '700', color: '#00D4FF',
      }}>{index + 1}</div>
      <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{player.name}</div>
    </div>
  )
}

function S4RosterView({ search = '' }) {
  const allPlayers = search.trim()
    ? S4_PLAYERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : S4_PLAYERS

  return (
    <div>
      {/* Season 4 Hero Banner */}
      <div style={{
        margin: '0 0 24px',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,165,0,0.06) 50%, rgba(204,34,0,0.08) 100%)',
        border: '1px solid rgba(255,215,0,0.3)',
        borderRadius: '16px',
        padding: '24px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,215,0,0.08)', pointerEvents: 'none',
        }} />
        <div>
          <div style={{ color: '#FFD700', fontSize: '11px', letterSpacing: '3px', fontWeight: '700', marginBottom: '6px' }}>
            ✦ UPCOMING SEASON
          </div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: '900', letterSpacing: '3px', lineHeight: 1 }}>
            CPL SEASON 4
          </div>
          <div style={{ color: '#FFA500', fontSize: '13px', marginTop: '6px', letterSpacing: '1px' }}>
            REGISTERED PARTICIPANTS
          </div>
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.4)',
          borderRadius: '10px', padding: '14px 24px', textAlign: 'center',
        }}>
          <div style={{ color: '#FFD700', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>
            {allPlayers.length}{search ? ` / ${S4_PLAYERS.length}` : ''}
          </div>
          <div style={{ color: '#8899CC', fontSize: '11px', letterSpacing: '2px', marginTop: '4px' }}>
            {search ? 'MATCHES' : 'REGISTERED'}
          </div>
        </div>
      </div>

      {/* Player Grid */}
      {allPlayers.length === 0
        ? <div style={{ padding:'40px', textAlign:'center', color:'#8899CC', background:'rgba(255,215,0,0.03)', borderRadius:'12px', border:'1px solid rgba(255,215,0,0.1)' }}>
            No players found for "{search}"
          </div>
        : <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '8px',
          }}>
            {allPlayers.map((player, i) => (
              <S4RosterCard key={i} player={player} index={i} />
            ))}
          </div>
      }

      <div style={{
        marginTop: '20px', padding: '12px 16px',
        background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)',
        borderRadius: '8px', color: '#8899CC', fontSize: '12px', textAlign: 'center'
      }}>
        ✦ &nbsp; Season 4 stats will be updated as matches are played
      </div>
    </div>
  )
}

// ─── Search Box ───────────────────────────────────────────────────────────────
function SearchBox({ value, onChange, gold }) {
  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <span style={{
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        color: '#8899CC', fontSize: '15px', pointerEvents: 'none',
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '11px 40px 11px 40px',
          background: gold ? 'rgba(255,215,0,0.05)' : 'rgba(0,212,255,0.05)',
          border: `1px solid ${gold ? 'rgba(255,215,0,0.3)' : 'rgba(0,212,255,0.25)'}`,
          borderRadius: '8px',
          color: '#fff', fontSize: '14px', fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#8899CC', cursor: 'pointer',
          fontSize: '16px', lineHeight: 1, padding: 0,
        }}>✕</button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const router = useRouter()
  const [season, setSeason] = useState('4')
  const [tab, setTab] = useState('roster')
  const [search, setSearch] = useState('')

  const isS4 = season === '4'
  const key = `s${season}_${tab}`
  const rawTableData = (!isS4 && tab !== 'roster') ? (CPL_DATA[key] || []) : []
  const tableData = search.trim()
    ? rawTableData.filter(r => r['Player Name']?.toLowerCase().includes(search.toLowerCase()))
    : rawTableData
  const tableLabel = tab === 'mvp' ? 'MVP LEADERBOARD' : tab === 'bat' ? 'BATTING LEADERBOARD' : 'BOWLING LEADERBOARD'

  const handleSeasonChange = (s, t) => { setSeason(s); setTab(t); setSearch('') }
  const handleTabChange = (t) => { setTab(t); setSearch('') }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
      <Navbar title="SEASON STATS" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <div style={{ color:'#8899CC', fontSize:'12px', letterSpacing:'3px', marginBottom:'4px' }}>CLUBLIFE PREMIER LEAGUE</div>
            <div style={{ color:'#fff', fontSize:'26px', fontWeight:'700', letterSpacing:'2px' }}>SEASON STATISTICS</div>
          </div>
          <div style={{ background:'#CC2200', padding:'6px 20px', borderRadius:'4px' }}>
            <span style={{ fontWeight:'700', fontSize:'20px', letterSpacing:'3px' }}>CPL</span>
          </div>
        </div>

        {/* Season Toggle */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ color:'#8899CC', fontSize:'12px', letterSpacing:'2px' }}>SEASON</span>
          {['2','3'].map(s => (
            <button key={s} onClick={() => handleSeasonChange(s, 'mvp')} style={TAB_BTN(season===s && !isS4)}>
              SEASON {s}
            </button>
          ))}
          <button onClick={() => handleSeasonChange('4', 'roster')} style={S4_TAB_BTN(season==='4')}>
            ✦ SEASON 4
          </button>
        </div>

        {/* Stat Tabs (seasons 2 & 3) */}
        {!isS4 && (
          <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
            {[['mvp','🏆 MVP'],['bat','🏏 BATTING'],['bowl','⚾ BOWLING']].map(([k,label]) => (
              <button key={k} onClick={() => handleTabChange(k)} style={TAB_BTN(tab===k)}>{label}</button>
            ))}
          </div>
        )}

        {/* Search — shown for all seasons */}
        <SearchBox value={search} onChange={setSearch} gold={isS4} />

        {/* Season 4 Roster */}
        {isS4 && <S4RosterView search={search} />}

        {/* Stats Table Card (seasons 2 & 3) */}
        {!isS4 && (
          <div style={{ background:'#0F1640', borderRadius:'16px', border:'1px solid rgba(0,212,255,0.2)', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'3px', height:'20px', background:'#00D4FF', borderRadius:'2px' }} />
              <span style={{ color:'#fff', fontWeight:'700', letterSpacing:'2px', fontSize:'14px' }}>
                {tableLabel} — SEASON {season}
              </span>
              <span style={{ marginLeft:'auto', color:'#8899CC', fontSize:'12px' }}>
                {tableData.length}{search ? ` of ${rawTableData.length}` : ''} players
              </span>
            </div>
            <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:'580px' }}>
              {tableData.length === 0
                ? <div style={{ padding:'40px', textAlign:'center', color:'#8899CC' }}>No players found for "{search}"</div>
                : <>
                    {tab==='mvp'  && <MvpTable  data={tableData} />}
                    {tab==='bat'  && <BatTable  data={tableData} />}
                    {tab==='bowl' && <BowlTable data={tableData} />}
                  </>
              }
            </div>
            <div style={{ padding:'10px 24px', borderTop:'1px solid rgba(0,212,255,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'#8899CC', fontSize:'12px' }}>
                {search ? `Showing ${tableData.length} result${tableData.length!==1?'s':''} for "${search}"` : `Scroll to see all ${tableData.length} players`}
              </span>
              <span style={{ color:'rgba(0,212,255,0.4)', fontSize:'11px', letterSpacing:'1px' }}>CPL SEASON {season}</span>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push('/home')}
          style={{
            marginTop:'24px', background:'transparent',
            border:'1px solid rgba(0,212,255,0.4)', borderRadius:'8px',
            padding:'12px 24px', color:'#00D4FF', fontSize:'14px',
            fontWeight:'700', letterSpacing:'2px', cursor:'pointer', fontFamily:'inherit'
          }}
        >← BACK</button>
      </div>
    </div>
  )
}