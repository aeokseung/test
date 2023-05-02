import React from 'react';

const sources = [
    { id: 1, type: 'image', link: 'https://www.flaticon.com/kr/free-icons/', title: '사람 아이콘', author: 'tuktukdesign - Flaticon' },
    { id: 2, type: 'image', link: 'https://www.flaticon.com/kr/free-icons/', title: '먼지 아이콘', author: 'cube29 - Flaticon' },
    { id: 3, type: 'image', link: 'https://www.flaticon.com/kr/free-icons/', title: '먼지 아이콘', author: 'LAFS - Flaticon' },
    { id: 4, type: 'image', link: 'https://www.flaticon.com/kr/free-animated-icons/', title: '날씨 애니메이션 아이콘', author: 'Freepik - Flaticon' },
    { id: 5, type: 'image', link: 'https://www.flaticon.com/kr/free-animated-icons/', title: '비 애니메이션 아이콘', author: 'Freepik - Flaticon' },
    { id: 6, type: 'image', link: 'https://www.flaticon.com/kr/free-animated-icons/', title: '눈 애니메이션 아이콘', author: 'Freepik - Flaticon' },
    { id: 7, type: 'image', link: 'https://www.flaticon.com/kr/free-animated-icons/', title: '태양 애니메이션 아이콘', author: 'Freepik - Flaticon' },
    { id: 8, type: 'image', link: 'https://www.flaticon.com/kr/free-icons/', title: '캠핑 아이콘', author: 'photo3idea_studio - Flaticon' },
    { id: 9, type: 'image', link: 'https://www.flaticon.com/kr/free-animated-icons/-', title: '지도 및 위치 애니메이션 아이콘', author: 'Freepik - Flaticon' },
    { id: 10, type: 'open API', link: 'https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073877', title: '에어코리아 측정소 정보' },
    { id: 11, type: 'open API', link: 'https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861', title: '에어코리아 대기오염 정보' },
    { id: 12, type: 'open API', link: 'https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084', title: '기상청 단기예보 조회서비스' },
    { id: 13, type: 'standard Data', link: 'https://www.data.go.kr/data/15021139/standard.do', title: '전국야영(캠핑)장표준데이터' }
];

function About() {
    return (
        <div>
            <h2 className="text-center" style={{marginBottom: "30px"}}>출처</h2>
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr style={{fontSize: "20px"}}>
                        <th>번호</th>
                        <th>유형</th>
                        <th>출처</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sources.map((source) => (
                        <tr key={source.id}>
                            <td>{source.id}</td>
                            <td>{source.type}</td>
                            <td>{source.author ? <a href={source.link} title={source.title}>{source.title} 제작자: {source.author}</a> : <a href={source.link} title={source.title}>{source.title}</a>}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default About;