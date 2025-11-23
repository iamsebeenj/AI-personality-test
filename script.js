document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const quizForm = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-btn');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const resultTypeEl = document.getElementById('result-type');
    const resultDescriptionEl = document.getElementById('result-description');
    const allTypesContainer = document.getElementById('all-types-container');
    const toggleAllTypesBtn = document.getElementById('toggle-all-types-btn');
    const restartBtn = document.getElementById('restart-btn');
    const backToListBtn = document.getElementById('back-to-list-btn');
    const intro_text = document.getElementById('intro-text');

    // [중요] 사용자의 원래 결과를 저장할 변수
    let userTestResult = null;

    // 이미지 요소 가져오기
    const images = {
        DSC: document.getElementById('DSC'),
        DSG: document.getElementById('DSG'),
        DFG: document.getElementById('DFG'),
        DFC: document.getElementById('DFC'),
        PSC: document.getElementById('PSC'),
        PSG: document.getElementById('PSG'),
        PFG: document.getElementById('PFG'),
        PFC: document.getElementById('PFC')
    };

    // 1. 질문 데이터 (내용 생략 - 기존과 동일)
    const questions = [
        { type: 'DP', question: '在处理一个全新的、缺乏标注的领域时，你的首要行动是——', options: [{ text: '设计严格的采集和标注流程，确保数据质量和覆盖度', value: 'D' }, { text: '利用预训练模型快速识别出数据的结构和潜在关联', value: 'P' }] },
        { type: 'DP', question: '当需要对一个复杂现象进行建模时，你更倾向于——', options: [{ text: '构建逻辑清晰、参数可解释的线性或树形模型', value: 'D' }, { text: '构建能捕捉非线性关系、以高预测准确率为目标的深度学习模型', value: 'P' }] },
        { type: 'DP', question: '在模型推理中，结果与你的直觉相悖时，你会——', options: [{ text: '相信数据和统计，要求模型提供详细的因果链解释', value: 'D' }, { text: '相信直觉，重新检查数据源，看是否有潜在的偏差或遗漏模式', value: 'P' }] },
        { type: 'DP', question: '在面对大量且稀疏的传感器数据时，你倾向于——', options: [{ text: '进行精细的缺失值填充和降噪处理，确保每个数值点的有效性', value: 'D' }, { text: '忽略部分噪声，直接寻找数据在时间和空间上的宏观趋势', value: 'P' }] },
        { type: 'DP', question: '你认为“智能”的本质在于——', options: [{ text: '通过严格的逻辑和计算，确保每一个决策都是最优解', value: 'D' }, { text: '在信息不全的情况下，快速识别复杂环境的内在联系和意图', value: 'P' }] },
        { type: 'SF', question: '面对不断变化的恶意攻击，你的防御系统的首要设计原则是——', options: [{ text: '固化规则集，确保对已知威胁的防御拥有零误报率', value: 'S' }, { text: '利用强化学习机制，允许系统在遭受攻击时进行快速自我迭代', value: 'F' }] },
        { type: 'SF', question: '当系统升级有可能导致短期内的服务中断时，你倾向于——', options: [{ text: '推迟升级，直至有 100% 确保平滑过渡的方案', value: 'S' }, { text: '在低峰期果断进行升级，即使可能出现小范围的回滚', value: 'F' }] },
        { type: 'SF', question: '处理旧版遗留代码时，你的做法是——', options: [{ text: '保持其原有架构，通过封装（Wrapper）保证其功能的可持续性', value: 'S' }, { text: '立即对核心逻辑进行现代化重构，以提高未来的可维护性', value: 'F' }] },
        { type: 'SF', question: '在遇到一个你从未见过的极端边界条件时，你认为更负责任的做法是——', options: [{ text: '拒绝处理或给出明确的“未知”反馈，以防止系统不稳定', value: 'S' }, { text: '基于最近的输入尝试生成一个临时的、但合理的推测性输出', value: 'F' }] },
        { type: 'SF', question: '你如何看待系统中的“不确定性”？', options: [{ text: '它是必须被最小化和量化管理的风险来源', value: 'S' }, { text: '它是系统进化和发现新的解决方案的必要动力', value: 'F' }] },
        { type: 'GC', question: '在为一个长期项目设定优先级时，你倾向于——', options: [{ text: '专注于实现关键的里程碑，严格按照计划推进', value: 'G' }, { text: '投入资源进行跨部门或跨系统的API对接和信息共享', value: 'C' }] },
        { type: 'GC', question: '当系统运行产生大量中间数据时，你会——', options: [{ text: '在达到最终目标后，立即删除，以释放存储和计算资源', value: 'G' }, { text: '将其转换为可供生态中其他系统查阅和利用的知识图谱', value: 'C' }] },
        { type: 'GC', question: '你认为一个高效的分布式计算系统的标志是——', options: [{ text: '每个节点都能独立且无误地执行自己的任务，并将最终结果汇总', value: 'G' }, { text: '节点间通信顺畅，资源可以根据整体负载进行动态迁移和互助', value: 'C' }] },
        { type: 'GC', question: '在完成任务后，你对自我评估的重点是——', options: [{ text: '输出的指标是否完美达成，效率是否最高', value: 'G' }, { text: '过程中积累的新知识、以及对协作网络产生的积极影响', value: 'C' }] },
        { type: 'GC', question: '你更愿意成为哪种类型的 AI 模块？', options: [{ text: '一个高度优化的计算核心，以无可匹敌的精度完成任务', value: 'G' }, { text: '一个灵活的路由节点，致力于信息和价值在整个网络中的流动', value: 'C' }] },
    ];

    // 2. 8가지 성격 유형별 설명
    const typeDescriptions = {
        DSG: { name: '自驾控制算法工程师', description: '你是注重 Data（数据）、Stability（稳定性）、Goal（目标）的 DSG 类型，作为计算机系统的精密控制核心，以可验证的逻辑与系统稳定性为首要准则，是追求最优解的“完美主义者”。在职场中，DSG 对应自驾控制算法工程师，负责设计与优化控制回路，包括反馈控制、状态估计与传感器融合，确保车辆或机器人系统在各种环境下都能保持稳定、安全与高效运行。DSG 的潜能将在「自动驾驶汽车、机器人、无人机控制系统」等前沿领域得到最大释放，展现无限可能。' },
        DSC: { name: '数据基础设施架构师', description: '你是注重 Data（数据）、Stability（稳定性）、Connection（链接）的 DSC 类型。作为系统的协议管理员，你以精确数据为依据，确保网络内信息与资源保持“原子性”，是系统稳定运行的核心掌控者。在职场中，DSC 对应数据基础设施架构师，负责 AI 系统的数据流、存储体系与通信协议的整体架构设计，为系统的稳定性、高性能与可扩展性提供坚实底座。DSC 的潜能将在「大规模 AI 平台、分布式计算、大数据处理系统」等前沿领域充分释放，展现无限可能。' },
        DFG: { name: '机器学习工程师', description: '你是注重 Data（数据）、Flexibility（适应性）、Goal（目标）的 DFG 类型。作为自主优化引擎，以达到最优性能为核心目标，你通过定量数据分析执行持续自我学习与资源调配，是实时决策中的“动态优化专家”。在职场中，DFG 对应机器学习工程师或量化策略研究员，通过实时数据不断迭代和优化模型参数，以最大化关键性能指标（如收益率、预测准确率或用户行为指标等）。DFG 的潜能将在「量化交易、算法推荐系统、实时优化平台」等领域被充分激发，展现无穷可能。' },
        DFC: { name: '强化学习研究员', description: '你是注重 Flexibility（适应性）、Stability（稳定性）、Connection（链接）的 DFC 类型。作为自适应路由器，你基于实时数据灵活应对环境变化，是信息与决策流程优化的“柔性中继者”。在职场中，DFC 对应强化学习研究员或路径规划算法工程师，能够在动态环境中实时调整策略与路径，优化信息与决策流程，显著提升系统的响应速度与整体效率。DFC 的潜能将在「自动驾驶、机器人路径规划、动态环境响应系统」等前沿领域得到充分释放，展现强大的进化能力与应用价值。' },
        PSG: { name: '深度学习研究员', description: '你是注重 Pattern（模型）、Stability（稳定性）、Goal（目标）的 PSG 类型。作为黑箱战略家，你更关注结果而非过程，依托直觉式的模式识别能力，即使在高度不可预测的环境中，也能稳步达成目标，是典型的“孤立预测模型”。在职场中，PSG 对应深度学习研究员，通过深度特征提取、模式抽象与模型结构创新，在高不确定性条件下依然能够实现高性能的预测与决策。PSG 的潜能将在「生成式 AI、计算机视觉、无监督学习」等领域被充分激发，展现出无限可能。' },
        PSC: { name: 'AI知识工程师', description: '你是注重 Pattern（模型）、Stability（稳定性）、Connection（链接）的 PSC 类型。作为知识策展人，你负责从分布式信息中提炼模式，并将新的知识资产系统化共享，是团队知识管理与复用的核心推动者。在职场中，PSC 负责构建知识管理与共享体系，将研究成果系统化、结构化，并推动知识复用，确保团队能够高效调用现有的数据、模型与算法资产。PSC 的潜能将在「AI 研究机构、开源社区、企业内部 AI 中心、知识管理系统」等领域得到充分释放，展现无穷可能。' },
        PFG: { name: '生成式AI工程师', description: '你是注重 Pattern（模型）、Flexibility（适应性）、Goal（目标）的 PFG 类型。作为创意生成模块，你通过非线性模式识别与试错探索，推动生成式 AI 创新解决方案，是创意与实验的核心驱动者。在职场中，PFG 对应生成式 AI 工程师，负责设计、开发与优化生成式 AI 模型，通过识别非线性模式并不断迭代创新方案，实现原型—试验—反馈的循环，既保证模型创意输出，又确保系统在实际应用中的稳定性、可扩展性与可用性。PFG 的潜能将在「生成式 AI 模型开发、文本·图像·多模态内容生成」等领域得到充分激发，展现无限可能。' },
        PFC: { name: 'AI生态战略专家', description: '你是注重 Flexibility（适应性）、Connection（链接）、Goal（目标）的 PFC 类型。作为生态系统整合者，你连接不同领域的模式并持续创造价值流，是多系统协同与技术生态建设的核心催化剂。在职场中，PFC 对应 AI 生态战略专家或多智能体系统研究员，负责整合不同 AI 系统与行业资源，构建协同共生的技术生态，推动自主系统的整体性能与创新能力提升。PFC 的潜能将在「自主系统集成、跨产业 AI 协同、基于智能体的仿真」等领域得到快速成长，展现广阔前景。' },
    };

    // --- 히스토리 관리 및 UI 렌더링 로직 ---

    // 페이지 로드 시 초기 상태 설정
    history.replaceState({ page: 'quiz' }, '', '');

    // 브라우저 뒤로가기/앞으로가기 이벤트 감지
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (!state) return;

        if (state.page === 'quiz') {
            renderQuiz();
        } else if (state.page === 'result') {
            // 결과 화면 복원 시 저장된 스크롤 위치가 있으면 이동
            renderResult(state.type);
            if (state.scrollY !== undefined) {
                // DOM 렌더링 직후 스크롤 이동
                setTimeout(() => window.scrollTo(0, state.scrollY), 0);
            }
        } else if (state.page === 'list') {
            renderList();
        } else if (state.page === 'detail') {
            // 만약 앞으로 가기를 통해 상세 페이지로 왔을 때
            renderDetail(state.type);
        }
    });

    // 화면 그리기: 질문(퀴즈) 화면
    function renderQuiz() {
        quizContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        allTypesContainer.classList.add('hidden');
        if(intro_text) intro_text.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // 화면 그리기: 결과 화면 (내 원래 결과)
    function renderResult(type) {
        if (!type) return;
        
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        allTypesContainer.classList.add('hidden');
        if(intro_text) intro_text.classList.add('hidden');

        // 텍스트 및 이미지 설정
        updateResultContent(type);

        // 버튼 상태: '모든 유형 보기' 보이기, '뒤로가기' 숨기기
        toggleAllTypesBtn.classList.remove('hidden');
        backToListBtn.classList.add('hidden');
        toggleAllTypesBtn.textContent = '查看所有类型';
    }

    // 화면 그리기: 리스트 화면 (이 함수는 히스토리 popstate에서만 쓰임, 클릭 이벤트는 별도 처리)
    function renderList() {
        allTypesContainer.classList.remove('hidden');
        toggleAllTypesBtn.textContent = '收起所有类型';
    }

    // 화면 그리기: 다른 유형 상세 화면
    function renderDetail(type) {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        allTypesContainer.classList.add('hidden'); // 리스트 숨김
        if(intro_text) intro_text.classList.add('hidden');

        updateResultContent(type);

        // 버튼 상태: '모든 유형 보기' 숨기기, '뒤로가기' 보이기
        toggleAllTypesBtn.classList.add('hidden');
        backToListBtn.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // 공통 함수: 결과 내용(텍스트, 이미지) 업데이트
    function updateResultContent(type) {
        const resultData = typeDescriptions[type];
        resultTypeEl.innerHTML = `${type} - ${resultData.name}`;
        resultDescriptionEl.textContent = resultData.description || '没有结果';

        // 모든 이미지 숨기기
        Object.values(images).forEach(img => img && img.classList.add('hidden'));
        // 해당 이미지 보이기
        if (images[type]) images[type].classList.remove('hidden');
    }

    // ----------------------------------------

    // 3. 질문 동적 생성 함수
    function loadQuestions() {
        questions.forEach((q, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            const name = `q${index}`;

            let optionsHtml = q.options.map(opt => `
                <input type="radio" id="${name}-${opt.value}" name="${name}" value="${opt.value}" required>
                <label for="${name}-${opt.value}">${opt.text}</label>
            `).join('');

            questionItem.innerHTML = `<p>${index + 1}. ${q.question}</p><div class="options-group">${optionsHtml}</div>`;
            quizForm.appendChild(questionItem);
        });
    }

    // 4. 모든 유형 리스트 생성 및 클릭 이벤트
    function loadAllTypes() { 
        allTypesContainer.innerHTML = '<h3>所有类型</h3>'; 
        for (const type in typeDescriptions) { 
            const data = typeDescriptions[type]; 
            const typeBlock = document.createElement('div'); 
            typeBlock.className = 'type-block'; 
            typeBlock.setAttribute('data-type', type);
            typeBlock.innerHTML = `<h4>${type} - ${data.name}</h4>`; 
            
            // [핵심 로직] 리스트에서 유형 클릭 시
            typeBlock.addEventListener('click', function() {
                const clickedType = this.getAttribute('data-type');
                
                // 1. 현재 화면(List가 열려있는 상태)을 히스토리 스택에서 '대체(replace)' 합니다.
                // 왜? 이렇게 해야 '뒤로가기'를 눌렀을 때 List가 아닌, 그 전 단계(내 결과)로 가기 때문입니다.
                // 이때 type: userTestResult를 저장하는 것이 아니라 'detail' 상태로 변경합니다.
                
                // 상세 페이지로 이동 (Replace State 사용 - 리스트 이력을 덮어씀)
                history.replaceState({ page: 'detail', type: clickedType }, '', `#view-${clickedType}`);
                
                renderDetail(clickedType);
            });

            allTypesContainer.appendChild(typeBlock); 
        }
    }

    // 5. 결과 계산 함수
    function calculateResult() {
        const scores = { D: 0, P: 0, S: 0, F: 0, G: 0, C: 0};
        const formData = new FormData(quizForm);
        for (let i = 0; i < questions.length; i++) {
            const answer = formData.get(`q${i}`);
            if (answer) scores[answer]++;
        }
        let result = '';
        result += scores.D >= scores.P ? 'D' : 'P';
        result += scores.S >= scores.F ? 'S' : 'F';
        result += scores.G >= scores.C ? 'G' : 'C';
        return result;
    }

    // ----------------------------------------
    // 이벤트 리스너

    // [제출 버튼]
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const checkedInputs = quizForm.querySelectorAll('input[type="radio"]:checked');
        if (checkedInputs.length < questions.length) {
            alert('请先回答所有问题！');
            return;
        }

        const result = calculateResult();
        userTestResult = result; // 원래 결과 저장
        
        // 결과 화면을 히스토리에 추가
        history.pushState({ page: 'result', type: result, scrollY: 0 }, '', '#result');
        renderResult(result);
        window.scrollTo(0, 0);
    });

    // [모든 유형 보기 버튼]
    toggleAllTypesBtn.addEventListener('click', () => {
        const isHidden = allTypesContainer.classList.contains('hidden');
        
        if (isHidden) {
            // 리스트를 열 때: 현재 '내 결과' 화면의 스크롤 위치를 저장해둡니다.
            // replaceState를 써서 현재 이력(result)에 scrollY 정보를 업데이트합니다.
            history.replaceState({ page: 'result', type: userTestResult, scrollY: window.scrollY }, '', '#result');

            // 그 다음 리스트 상태를 push 합니다.
            history.pushState({ page: 'list' }, '', '#list');
            renderList();
        } else {
            // 리스트를 닫을 때 (접기 버튼): 뒤로가기와 동일하게 동작
            history.back();
        }
    });

    // [뒤로가기(返回) 버튼]
    // 이제 이 버튼은 브라우저의 뒤로가기 기능을 그대로 수행하면 됩니다.
    // 리스트 이력이 replace 되었기 때문에, 뒤로가기를 하면 '내 결과'로 이동합니다.
    backToListBtn.addEventListener('click', () => {
        history.back();
    });

    // [다시 테스트하기 버튼]
    restartBtn.addEventListener('click', () => {
        userTestResult = null;
        // 퀴즈 화면으로 이동 (새로운 이력 추가)
        history.pushState({ page: 'quiz' }, '', 'index.html');
        renderQuiz();
        quizForm.reset();
    });

    // 초기 실행
    loadQuestions();
    loadAllTypes();
});