#!/usr/bin/env python3
"""MAVPY site v3.0 ("Swiss workshop"). One template → EN (/) and UA (/ua/).
Usage: python3 tools/build.py .   (writes index.html and ua/index.html into the repo)"""
import os, sys

REPO = sys.argv[1]
FONTS = ("https://fonts.googleapis.com/css2?family=BBH+Hegarty&family=Archivo:wght@800;900"
         "&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&family=Inter:wght@100;800;900"
         "&family=Unbounded:wght@900&display=swap")
PLUS = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 2v14M2 9h14"/></svg>'
ARROW = '<span class="ar" aria-hidden="true">→</span>'

E = dict(
  html_lang='en', title='MAVPY — websites that bring more clients',
  desc='A small studio that designs and builds websites for growing businesses, then wires in online booking and lead handling. Fixed price, from $500.',
  nav=['How we work', 'Cases', 'Pricing', 'Contact'], menu='Menu', lang_group='Language', cta='Get my estimate',
  kicker='<b>Conversion-focused</b> websites for growing businesses', more='MORE', clients='clients',
  notjust='Not just<br>a new<br>website', hero_note='Scoped, priced upfront,<br>delivered end-to-end.',
  strip=['30+ projects since 2022', 'Fixed price, no surprises', 'Founder-led, direct', 'Reply within 24h',
         'Pay in 3 parts', 'Booking, CRM and bot wired in', 'You own the site and the code'],
  strip_label='Why clients work with us',
  fc_idx='Featured case', fc_h='Doctor LOR', fc_sub='ENT clinic in Kharkiv: from phone-only booking to a site that books itself',
  fc_p='Before: patients could only book by phone, on a site from the early 2000s. Now booking runs itself and reminders go out on their own.',
  fc_stats=[('5,000', 'operations performed'), ('20 yrs', 'of surgical practice'), ('1 click', 'to book from any screen')],
  live='Open live site', read_case='Read the case ↓',
  sit_idx='Situation', sit_h='Which of these sounds<br>like you right now?', sit_p='Find yours. That’s what we’ll build around.',
  sit=[('Your site costs you deals', 'Visitors make up their minds in seconds, long before they ever read your pitch.', 'A first screen that answers “why you” in five seconds.'),
       ('Referrals aren’t enough', 'Luck isn’t a plan. You need a steady, predictable stream of qualified leads.', 'Ads and a page built to turn them into enquiries.'),
       ('Traffic, but no enquiries', 'People visit, but the site fails to turn them into real business enquiries.', 'One clear action on every screen, and a form that takes 20 seconds.')],
  proc_idx='Process', proc_h='How we do it', proc_p='One clear path. The right people for your goal, no more, no less.',
  steps=[('Full cycle, done for you', 'From zero to a steady flow of clients. Nothing gets lost in hand-offs.'),
         ('Minimal load on your side', 'We agree on the decisions that matter, handle the rest, and leave you free to run your business.'),
         ('Live in as little as 2 weeks', 'We set the timeline before we start, tie it to your scope, and hold to it.')],
  steps_more=['Strategy, copy, design, build, booking and ads. One team, one contract.', 'You approve three things: the plan, the design and the launch. We handle the rest.', 'Week 1: plan and design. Week 2: build, connect and launch.'],
  cols=['#', 'Project', 'Industry', 'Result'], what='What I do',
  cases_idx='Cases', cases_h='Real projects,<br>real results', cases_p='Task, solution, result. The same three lines on every case.',
  dt=['Task', 'Solution', 'Result'], case_word='case',
  cases=[
    ('Doctor LOR', 'ENT clinic · Kharkiv', 'trust before surgery', 'case-doctor-lor', 'https://www.drlor-kh.com/', 'drlor-kh.com',
     'People spend months choosing a surgeon and are afraid of the operation itself. Booking was by phone only, on a site from the early 2000s.',
     'A first screen about the outcome: breathe freely, look natural. Facts up front: 5,000 operations, 20 years of practice, sedation included. One-click booking with automatic reminders.',
     'Booking runs on its own and reminders go out automatically. Enquiries arrive steadily where there used to be only word of mouth.'),
    ('Aurelia Dental', 'Premium dentistry · Antalya', 'patients from abroad', 'case-aurelia-dental', 'https://aurelia-dental.webflow.io/', 'aurelia-dental.webflow.io',
     'Patients from other countries decide from a distance. They worry about pain and hidden costs.',
     'A calm, photo-led design and a fear-free treatment promise. A free online consultation before the flight. Two clear actions only: book, or get a free consultation.',
     'Patients from abroad book a free consultation before they travel. The questions the team used to repeat on every call are answered on the site.'),
    ('SRT', 'Chronic pain therapy', 'admin time back', 'case-srt-therapy', 'https://srt-bf60b5.webflow.io/', 'srt-bf60b5.webflow.io',
     'Clients arrive after years of pain and many failed treatments. Booking took up half of the administrator’s day.',
     'The method explained step by step, with 10+ years of practice on the first screen. Online booking synced with the calendar.',
     'Booking runs on its own. The administrator got half a day back, and clients just show up.'),
    ('The Nook', '12-room hotel by the sea', 'off-season bookings', 'case-the-nook', 'https://the-nook----premium-coastal-coliving-we.webflow.io/', 'the-nook.webflow.io',
     'Guests saw it as just another beach hotel, and it stood empty off-season.',
     'New positioning for remote workers: “Work by the sea. Rest with purpose.” A quiet workspace, open all year, packages for long stays.',
     'The off-season now has its own audience: remote workers who come for weeks, not days.'),
    ('Unit Surface', 'B2B rooftop solar', 'roof as income', 'case-unit-surface', 'https://unit-surface-c8e2de.webflow.io/', 'unit-surface.webflow.io',
     'Owners of industrial roofs don’t see solar as income, and B2B decisions take months.',
     'Headline “Your roof is an untapped financial asset”. An ROI calculator right on the first screen, with payback in 5–7 years.',
     'Visitors see their own payback numbers before the first call, so sales conversations start further along.')],
  rev_idx='Reviews', rev_h='In their words', rev_p='What clients said after launch.',
  reviews=[
    ('review-natalia-srt', 'Natalia M.', 'SRT · online booking', 'Booking used to eat half my administrator’s day. Now it runs on its own and patients just show up. Serhii handled everything, I barely had to step in.'),
    ('review-ivan', 'Ivan V.', 'Doctor LOR · new site and booking', 'We had visitors but almost no enquiries. Serhii didn’t just redesign, he asked why people were leaving first. That’s the difference. The form finally started filling.'),
    ('review-bram-spacem', 'Bram V.', 'Space’M Online · web design', 'Serhii is strong in communication, super fast in delivering the scope, overdelivers and is a real professional. Gladly recommend.'),
    ('review-aurelia', 'Clinic manager', 'Aurelia Dental · site for patients abroad', 'Patients from abroad now book a free consultation before they even buy tickets. The site answers the questions we used to repeat on every call.'),
    ('avatar-fallback-man', 'Owner', 'The Nook · positioning and booking', 'We stopped being just another beach hotel. Remote workers find us in winter now, and they stay for weeks, not days.'),
    ('avatar-fallback-woman', 'Founder', 'Unit Surface · site with ROI calculator', 'The ROI calculator handles the first sales conversation for us. Leads come in already knowing their numbers.')],
  team_idx='Team', team_h='The people behind<br>your project',
  tags=[['Research & UX', 'Site structure', 'Design in Figma', 'Project lead'], ['Webflow & custom code', 'Booking, CRM, Telegram bots', 'Integrations', 'Launch & support'], ['Positioning & offer', 'Website copy', 'Case studies', 'Ad content'], ['Google & Meta ads', 'Analytics & tracking', 'Cost per enquiry reports', 'Budget planning']],
  team=[('team-serhii', 'Serhii', 'Designer & product manager', 'I start with why people leave your site, then design the page that keeps them. From the first call to launch, you talk to me.'),
        ('team-nikita', 'Nikita', 'Developer & automation', 'I build the site and connect it to what you already use: booking, CRM, a Telegram bot. Every request lands where your team will see it.'),
        ('team-julia', 'Julia', 'Marketing & copywriting', 'I write in your clients’ words, not ours. Each headline answers one question: why choose you over the business next door.'),
        ('team-marina', 'Marina', 'Ads & analytics', 'I run your ads and set up tracking, so you see which channel brings paying clients and which one only spends the budget.')],
  price_idx='Pricing', price_h='Pick your goal,<br>see the price', price_p='No form, no call just to see a number. Find your goal and see where it starts.',
  pay=['Pay once', 'Pay in 3 parts'], badge='Most popular', from_='from', price_note='',
  plans=[('Attract new clients', 'A site that turns strangers into enquiries, and ads that keep them coming.', ['Online positioning', 'Site design & build', 'Ad setup & automation'], '$500', '3 × $167', 'clients'),
         ('Launch a new service', 'One page that makes the new offer impossible to misunderstand.', ['Landing page', 'Copy & visuals', 'Launch ad setup'], '$700', '3 × $234', 'service'),
         ('Revamp your website', 'A site you’re proud to send, modern and easy to find.', ['Redesign & build', 'Easy platform', 'Basic SEO'], '$800', '3 × $267', 'redesign')],
  contact_idx='Contact', contact_h='Tell us your goal.<br>We’ll price it.', contact_p='You’ve seen the ballpark: from $500. The exact figure comes on a short call. No sales marathon.',
  next_steps=['We reply within 24 hours', 'A 15-minute call about your goal', 'Fixed price and timeline in writing'],
  need='What do you need?', goals=[('clients', 'New clients'), ('service', 'New service'), ('redesign', 'Redesign'), ('ads', 'Ads & analytics'), ('auto', 'Automation')],
  f_name='Name', f_email='Email', f_phone='Phone (optional)', reply='We reply within 24h · no spam',
  done_h='Got it, thanks', done_p='We’ll reply within 24 hours.',
  err_name='Add your name so we know who to reply to.', err_email='Check the email, it looks incomplete.',
  err_net='The request didn’t go through. Try again or write to mavpy.studio@gmail.com.',
  foot_tag='Less noise.<br>More results.', foot_cols=('Navigate', 'Contact', 'Studio'), studio=['Design & development', 'Since 2022', 'EN / UA'],
  foot_nav='Footer navigation', top='Back to top ↑', copy='© 2022–2026 MAVPY Design & Dev')

U = dict(
  html_lang='uk', title='MAVPY — сайти, що приводять більше клієнтів',
  desc='Невелика студія, яка проєктує та розробляє сайти для бізнесу, що зростає, і налаштовує за ними онлайн-запис та обробку заявок. Фіксована ціна, від $500.',
  nav=['Як ми працюємо', 'Кейси', 'Ціни', 'Контакти'], menu='Меню', lang_group='Мова', cta='Отримати розрахунок',
  kicker='<b>Сайти</b>, що продають, для бізнесу, який зростає', more='БІЛЬШЕ', clients='клієнтів',
  notjust='Не просто<br>новий<br>сайт', hero_note='Обсяг і ціну фіксуємо до старту,<br>робимо все під ключ.',
  strip=['30+ проєктів з 2022 року', 'Фіксована ціна без сюрпризів', 'Напряму із засновником', 'Відповідь протягом 24 годин',
         'Оплата трьома частинами', 'Запис, CRM і бот під ключ', 'Сайт і код належать вам'],
  strip_label='Чому з нами працюють',
  fc_idx='Головний кейс', fc_h='Doctor LOR', fc_sub='ЛОР-клініка в Харкові: від запису лише телефоном до сайту, що записує сам',
  fc_p='Раніше пацієнти могли записатися лише телефоном через сайт початку 2000-х. Тепер запис працює сам, а нагадування надходять автоматично.',
  fc_stats=[('5 000', 'проведених операцій'), ('20 років', 'хірургічної практики'), ('1 клік', 'до запису з будь-якого екрана')],
  live='Відкрити сайт', read_case='Читати кейс ↓',
  sit_idx='Ситуація', sit_h='Що з цього<br>про вас зараз?', sit_p='Знайдіть свою ситуацію. Саме від неї ми й будуватимемо сайт.',
  sit=[('Через сайт ви втрачаєте угоди', 'Відвідувач вирішує за кілька секунд, задовго до того, як прочитає вашу пропозицію.', 'Перший екран, що за п’ять секунд пояснює, чому саме ви.'),
       ('Рекомендацій замало', 'На везінні далеко не заїдеш. Потрібен стабільний і передбачуваний потік зацікавлених клієнтів.', 'Реклама і сторінка, що перетворює її на заявки.'),
       ('Трафік є, а заявок немає', 'Люди заходять на сайт, але він не перетворює їх на реальні звернення.', 'Одна зрозуміла дія на кожному екрані й форма на 20 секунд.')],
  proc_idx='Процес', proc_h='Як ми працюємо', proc_p='Один зрозумілий шлях. Саме ті люди, які потрібні для вашої мети, не більше й не менше.',
  steps=[('Повний цикл під ключ', 'Від нуля до стабільного потоку клієнтів. Нічого не губиться при передачі між підрядниками.'),
         ('Мінімум навантаження на вас', 'Узгоджуємо лише важливі рішення, решту беремо на себе, а ви спокійно займаєтеся бізнесом.'),
         ('Запуск уже за 2 тижні', 'Строки фіксуємо до старту, прив’язуємо до обсягу робіт і дотримуємося їх.')],
  steps_more=['Стратегія, тексти, дизайн, розробка, запис і реклама. Одна команда, один договір.', 'Ви погоджуєте три речі: план, дизайн і запуск. Решту робимо ми.', 'Тиждень 1: план і дизайн. Тиждень 2: розробка, підключення і запуск.'],
  cols=['#', 'Проєкт', 'Сфера', 'Результат'], what='Чим займаюся',
  cases_idx='Кейси', cases_h='Реальні проєкти,<br>реальні результати', cases_p='Задача, рішення, результат. Однакова структура в кожному кейсі.',
  dt=['Задача', 'Рішення', 'Результат'], case_word='кейс',
  cases=[
    ('Doctor LOR', 'ЛОР-клініка · Харків', 'довіра до операції', 'case-doctor-lor', 'https://www.drlor-kh.com/', 'drlor-kh.com',
     'Люди місяцями обирають хірурга і бояться самої операції. Записатися можна було лише телефоном, через сайт початку 2000-х.',
     'Перший екран про результат: дихайте вільно, виглядайте природно. Факти одразу: 5 000 операцій, 20 років практики, седація включена. Запис в один клік з автоматичними нагадуваннями.',
     'Запис працює сам, нагадування надходять автоматично. Заявки приходять стабільно там, де раніше були лише рекомендації.'),
    ('Aurelia Dental', 'Преміальна стоматологія · Анталія', 'пацієнти з-за кордону', 'case-aurelia-dental', 'https://aurelia-dental.webflow.io/', 'aurelia-dental.webflow.io',
     'Пацієнти з інших країн вирішують на відстані. Вони бояться болю та прихованих платежів.',
     'Спокійний дизайн, де головне — фото, і обіцянка лікування без страху. Безкоштовна онлайн-консультація ще до перельоту. Лише дві дії: записатися або отримати консультацію.',
     'Пацієнти з-за кордону записуються на безкоштовну консультацію ще до поїздки. Відповіді на питання, які команда повторювала на кожному дзвінку, тепер на сайті.'),
    ('SRT', 'Терапія хронічного болю', 'час адміністратора', 'case-srt-therapy', 'https://srt-bf60b5.webflow.io/', 'srt-bf60b5.webflow.io',
     'Клієнти приходять після років болю і багатьох невдалих спроб лікування. Запис забирав пів дня адміністратора.',
     'Метод пояснено крок за кроком, на першому екрані — 10+ років практики. Онлайн-запис, синхронізований з календарем.',
     'Запис працює сам. Адміністратор отримав пів дня назад, а клієнти просто приходять.'),
    ('The Nook', 'Готель на 12 номерів біля моря', 'бронювання поза сезоном', 'case-the-nook', 'https://the-nook----premium-coastal-coliving-we.webflow.io/', 'the-nook.webflow.io',
     'Гості сприймали його як ще один пляжний готель, і поза сезоном він пустував.',
     'Нове позиціонування для тих, хто працює віддалено: «Працюй біля моря. Відпочивай зі змістом». Тихе робоче місце, відкрито цілий рік, пакети для довгого проживання.',
     'Поза сезоном тепер є своя аудиторія: люди на віддаленій роботі, які приїжджають на тижні, а не на дні.'),
    ('Unit Surface', 'B2B сонячні станції на дахах', 'дах як дохід', 'case-unit-surface', 'https://unit-surface-c8e2de.webflow.io/', 'unit-surface.webflow.io',
     'Власники промислових дахів не бачать у сонячній станції дохід, а B2B-рішення ухвалюються місяцями.',
     'Заголовок «Ваш дах — невикористаний фінансовий актив». Калькулятор окупності просто на першому екрані, окупність за 5–7 років.',
     'Відвідувачі бачать свої цифри окупності ще до першого дзвінка, тому розмова про продаж починається на крок далі.')],
  rev_idx='Відгуки', rev_h='Їхніми словами', rev_p='Що клієнти сказали після запуску.',
  reviews=[
    ('review-natalia-srt', 'Наталія М.', 'SRT · онлайн-запис', 'Запис забирав у мого адміністратора пів робочого дня. Тепер він працює сам, і пацієнти просто приходять. Сергій зробив усе, мені майже не довелося втручатися.'),
    ('review-ivan', 'Іван В.', 'Doctor LOR · новий сайт і запис', 'Відвідувачі були, а заявок майже не було. Сергій не просто зробив редизайн, він спершу з’ясував, чому люди йдуть. У цьому різниця. Форма нарешті почала заповнюватися.'),
    ('review-bram-spacem', 'Bram V.', 'Space’M Online · вебдизайн', 'Serhii is strong in communication, super fast in delivering the scope, overdelivers and is a real professional. Gladly recommend.'),
    ('review-aurelia', 'Менеджерка клініки', 'Aurelia Dental · сайт для іноземних пацієнтів', 'Пацієнти з-за кордону тепер записуються на безкоштовну консультацію ще до того, як купують квитки. Сайт відповідає на питання, які ми повторювали на кожному дзвінку.'),
    ('avatar-fallback-man', 'Власник', 'The Nook · позиціонування і бронювання', 'Ми перестали бути ще одним пляжним готелем. Тепер нас знаходять ті, хто працює віддалено, навіть узимку, і залишаються на тижні, а не на дні.'),
    ('avatar-fallback-woman', 'Засновниця', 'Unit Surface · сайт з калькулятором окупності', 'Калькулятор окупності проводить першу розмову про продаж за нас. Клієнти приходять, уже знаючи свої цифри.')],
  team_idx='Команда', team_h='Люди, які працюють<br>над вашим проєктом',
  tags=[['Дослідження і UX', 'Структура сайту', 'Дизайн у Figma', 'Ведення проєкту'], ['Webflow і власний код', 'Запис, CRM, Telegram-боти', 'Інтеграції', 'Запуск і підтримка'], ['Позиціонування й оферта', 'Тексти для сайту', 'Кейси', 'Контент для реклами'], ['Реклама Google і Meta', 'Аналітика й відстеження', 'Звіти про ціну заявки', 'Планування бюджету']],
  team=[('team-serhii', 'Сергій', 'Дизайнер і продакт-менеджер', 'Спершу з’ясовую, чому люди йдуть із сайту, і лише потім малюю сторінку, яка їх утримає. Від першого дзвінка до запуску ви говорите зі мною.'),
        ('team-nikita', 'Нікіта', 'Розробка та автоматизація', 'Збираю сайт і підключаю його до того, чим ви вже користуєтесь: запис, CRM, Telegram-бот. Кожна заявка потрапляє туди, де її побачить ваша команда.'),
        ('team-julia', 'Юлія', 'Маркетинг і тексти', 'Пишу словами ваших клієнтів, а не нашими. Кожен заголовок відповідає на одне питання: чому обрати вас, а не сусідній бізнес.'),
        ('team-marina', 'Марина', 'Реклама й аналітика', 'Запускаю рекламу й налаштовую аналітику, щоб ви бачили, який канал приводить клієнтів, а який лише витрачає бюджет.')],
  price_idx='Ціни', price_h='Оберіть мету,<br>побачте ціну', price_p='Без форм і дзвінків, щоб просто дізнатися ціну. Знайдіть свою мету і подивіться, з якої суми вона починається.',
  pay=['Одним платежем', 'Трьома частинами'], badge='Найпопулярніше', from_='від',
  price_note='Ціни в гривнях за курсом НБУ на день оплати. Будь-який пакет можна розбити на 3 платежі.',
  plans=[('Залучити нових клієнтів', 'Сайт, що перетворює незнайомців на заявки, і реклама, яка приводить їх знову і знову.', ['Позиціонування онлайн', 'Дизайн і розробка сайту', 'Реклама та автоматизація'], '₴21 000 <small>($500)</small>', '3 × ₴7 000 <small>($167)</small>', 'clients'),
         ('Запустити нову послугу', 'Одна сторінка, після якої нову пропозицію неможливо зрозуміти неправильно.', ['Лендинг', 'Тексти та візуал', 'Налаштування реклами на запуск'], '₴29 000 <small>($700)</small>', '3 × ₴9 700 <small>($234)</small>', 'service'),
         ('Оновити сайт', 'Сайт, який не соромно надіслати: сучасний і легкий для пошуку.', ['Редизайн і розробка', 'Зручна платформа', 'Базове SEO'], '₴33 000 <small>($800)</small>', '3 × ₴11 000 <small>($267)</small>', 'redesign')],
  contact_idx='Контакти', contact_h='Розкажіть про мету.<br>Ми порахуємо ціну.', contact_p='Орієнтир ви вже бачили: від $500. Точну суму назвемо після короткого дзвінка. Без довгих продажів.',
  next_steps=['Відповідаємо протягом 24 годин', '15-хвилинний дзвінок про вашу мету', 'Фіксована ціна і строки письмово'],
  need='Що вам потрібно?', goals=[('clients', 'Нові клієнти'), ('service', 'Нова послуга'), ('redesign', 'Редизайн'), ('ads', 'Реклама й аналітика'), ('auto', 'Автоматизація')],
  f_name='Ім’я', f_email='Email', f_phone='Телефон (необов’язково)', reply='Відповімо протягом 24 год · без спаму',
  done_h='Дякуємо, отримали', done_p='Відповімо протягом 24 годин.',
  err_name='Вкажіть ім’я, щоб ми знали, кому відповісти.', err_email='Перевірте email, схоже, він неповний.',
  err_net='Заявка не надіслалася. Спробуйте ще раз або напишіть на mavpy.studio@gmail.com.',
  foot_tag='Менше шуму.<br>Більше результатів.', foot_cols=('Навігація', 'Контакти', 'Студія'), studio=['Дизайн і розробка', 'З 2022 року', 'EN / UA'],
  foot_nav='Навігація у футері', top='Нагору ↑', copy='© 2022–2026 MAVPY Design & Dev')

CONTACTS = [('mailto:mavpy.studio@gmail.com', 'mavpy.studio@gmail.com'), ('tel:+380992208343', '+380 99 220 83 43'),
            ('https://instagram.com/mavpy_agency', 'Instagram @mavpy_agency'), ('https://t.me/mavpy_agency', 'Telegram @mavpy_agency')]


def head(n, label, title, lead=None, cls=''):
    ld = f'<p class="v-lead">{lead}</p>' if lead else ''
    return (f'<div class="v-head {cls}"><p class="v-idx"><span class="n">{n:02d}</span><span>{label}</span></p>'
            f'<div><h2 class="v-h2">{title.replace("<br>", " <br>")}</h2>{ld}</div></div>')


def img(name, alt, cls='', ext='jpg', lazy=True):
    return f'<img class="{cls}" src="{{P}}assets/img/{name}.{ext}" alt="{alt}"{" loading=\"lazy\"" if lazy else ""} decoding="async">'


def page(t, lang):
    t = dict(t); t['reviews'] = t['reviews'][:3]  # v3.1: only confirmed reviews until clients approve the drafts
    ua = lang == 'uk'
    P = '../' if ua else ''
    en_href, ua_href = ('../', './') if ua else ('./', 'ua/')
    cur_en, cur_ua = ('false', 'true') if ua else ('true', 'false')
    anchors = ['#how', '#cases', '#pricing', '#contact']
    nav = ''.join(f'<a class="n" href="{h}">{n}</a>' for h, n in zip(anchors, t['nav']))
    langs = (f'<div class="mv-lang" role="group" aria-label="{t["lang_group"]}">'
             f'<a href="{en_href}" data-lang="en" hreflang="en" aria-current="{cur_en}">EN</a><span class="sep" aria-hidden="true">/</span>'
             f'<a href="{ua_href}" data-lang="uk" hreflang="uk" aria-current="{cur_ua}">UA</a></div>')
    o = [f'<div class="mv m-kinetic" lang="{lang}" data-lang-redirect="">']
    # header + hero (unchanged layout)
    o.append(f'''<header class="mv-wrap mv-head">
  <a href="#top" class="mv-logo" aria-label="MAVPY"><img class="mv-logo-img" src="{P}assets/img/logo-dark.svg" alt="MAVPY design &amp; dev"></a>
  <nav class="mv-nav" aria-label="Main">{nav}{langs}<a href="#contact" class="mv-btn mv-btn--sm">{t["cta"]}</a></nav>
  <button type="button" class="mv-burger" aria-expanded="false" aria-label="{t["menu"]}"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0F0F0F" stroke-width="1.6" aria-hidden="true"><path d="M2 6h14M2 12h14"/></svg></button>
</header>
<nav class="mv-wrap mv-mnav" aria-label="{t["menu"]}" hidden="hidden">
  {nav}
  <div class="mv-mnav-row">{langs}<a href="#contact" class="mv-btn">{t["cta"]}</a></div>
</nav>
<main>
<section id="top" class="mv-hero" data-spotlight="">
  <div class="a-bg" aria-hidden="true" style="position:absolute;inset:0;--d:1.05s"><div class="mv-mat"></div><div class="mv-mat-glow"></div></div>
  <div class="mv-wrap mv-hero-in">
    <div class="mv-hero-top">
      <div>
        <p class="mv-kicker a-blur" style="--d:.45s">{t["kicker"]}</p>
        <h1 style="margin:0">
          <span class="a-mask"><span class="mv-more"><span class="mv-bars" aria-hidden="true"><i></i><i></i><i></i></span>{t["more"]}</span></span>
          <span class="a-mask"><span class="mv-clients" style="--d:.15s">{t["clients"]}</span></span>
        </h1>
      </div>
      <p class="mv-notjust a-blur" style="--d:.5s">{t["notjust"]}</p>
    </div>
    <div class="mv-hero-bottom">
      <p class="mv-hero-note a-blur" style="--d:.6s">{t["hero_note"]}</p>
      <a href="#contact" class="mv-btn a-rise" style="--d:.8s">{t["cta"]} {ARROW}</a>
    </div>
  </div>
</section>''')
    items = lambda hid: ''.join(f'<span class="mv-strip-item"{" aria-hidden=\"true\"" if hid else ""}><i aria-hidden="true"></i>{s}</span>' for s in t['strip'])
    o.append(f'<div class="mv-strip"><div class="mv-marq" role="region" aria-label="{t["strip_label"]}"><div class="mv-track">{items(False)}{items(True)}</div></div></div>')
    # 01 featured case (v3.1: full-width screenshot with outline, stats in a row, all black)
    stats = ''.join(f'<li><b>{n}</b><span>{l}</span></li>' for n, l in t['fc_stats'])
    c0 = t['cases'][0]
    o.append(f'''<section class="v-sec" data-reveal="">
  <div class="v-wrap">{head(1, t["fc_idx"], t["fc_h"], t["fc_sub"])}
    <a class="v-feat-shot" href="{c0[4]}" target="_blank" rel="noopener" aria-label="{t["live"]}: {c0[5]}">{img(c0[3], 'Doctor LOR website', 'v-shot')}</a>
    <div class="v-feat">
      <div class="v-feat-txt"><p class="v-lead" style="margin:0">{t["fc_p"]}</p>
        <div class="v-actions"><a class="mv-btn" href="{c0[4]}" target="_blank" rel="noopener">{t["live"]} {ARROW}</a><a class="mv-btn mv-btn--line" href="#cases">{t["read_case"]}</a></div></div>
      <ul class="v-stats">{stats}</ul>
    </div>
  </div>
</section>''')
    # 02 situation
    lit = [[0], [0, 1, 3], [0, 1, 2, 3, 4, 6]]
    cards = ''
    for i, (h, p, fix) in enumerate(t['sit']):
        cells = ''.join(f'<i{" class=\"on\"" if k in lit[i] else ""} style="--k:{k}"></i>' for k in range(9))
        cards += (f'<div class="v-card v-pain"><div class="v-pain-top"><span class="v-num">0{i+1}</span><span class="v-cells" aria-hidden="true">{cells}</span></div>'
                  f'<h3 class="v-h3">{h}</h3><p>{p}</p><p class="v-fix"><span aria-hidden="true">→</span>{fix}</p></div>')
    o.append(f'<section class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(2, t["sit_idx"], t["sit_h"], t["sit_p"])}<div class="v-3">{cards}</div></div></section>')
    # 03 process (v3.1: big static mascot, step rows, more info slides up on hover)
    steps = ''.join(f'<li class="v-step" tabindex="0"><span class="v-num">0{i+1}</span><h3 class="v-h3">{h}</h3><p>{p}</p><p class="v-more"><span aria-hidden="true">→</span>{t["steps_more"][i]}</p></li>' for i, (h, p) in enumerate(t['steps']))
    o.append(f'''<section id="how" class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(3, t["proc_idx"], t["proc_h"], t["proc_p"])}
  <div class="v-proc"><div class="v-mascot" data-mascot="">{img("mascot-3d", "", "", "png")}</div><ol class="v-steps">{steps}</ol></div>
</div></section>''')
    # 04 cases (dark)
    arts = ''
    for i, (name, kind, short, im, url, host, task, sol, res) in enumerate(t['cases']):
        cid = f'case-{i+1}'
        op = i == 0
        dl = ''.join(f'<div{" class=\"res\"" if k == 2 else ""}><dt>{d}</dt><dd>{v}</dd></div>' for k, (d, v) in enumerate(zip(t['dt'], (task, sol, res))))
        arts += f'''<article class="v-case{" is-open" if op else ""}">
  <div class="v-case-row"><span class="v-num">0{i+1}</span><h3 class="v-case-name">{name}</h3><span class="v-case-kind">{kind}</span><span class="v-case-short">{short}</span>
    <button type="button" class="mv-tog" aria-expanded="{str(op).lower()}" aria-controls="{cid}" aria-label="{name}, {t["case_word"]}">{PLUS}</button></div>
  <div class="mv-acc{" is-open is-in" if op else ""}" id="{cid}"><div><div class="v-case-body">
    <div class="v-case-shot">{img(im, name + " website")}</div>
    <div class="v-case-txt"><dl>{dl}</dl><p class="v-actions"><a class="mv-btn" href="{url}" target="_blank" rel="noopener">{t["live"]} {ARROW}</a><span class="v-host">{host}</span></p></div>
  </div></div></div>
</article>'''
    o.append(f'<section id="cases" class="v-sec v-dark" data-reveal=""><div class="v-wrap">{head(4, t["cases_idx"], t["cases_h"], t["cases_p"])}<div class="v-cols" aria-hidden="true"><span>{t['cols'][0]}</span><span>{t['cols'][1]}</span><span>{t['cols'][2]}</span><span>{t['cols'][3]}</span></div><div class="v-cases" data-accordion="">{arts}</div></div></section>')
    # 05 reviews
    def revs(hid):
        return ''.join(f'<figure class="v-card v-review"{" aria-hidden=\"true\"" if hid else ""}><span class="q" aria-hidden="true">“</span><blockquote>{q}</blockquote>'
                       f'<figcaption>{img(a, "", "v-ava", "png")}<span><strong>{n}</strong><em>{c}</em></span></figcaption></figure>' for a, n, c, q in t['reviews'])
    o.append(f'''<section class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(5, t["rev_idx"], t["rev_h"], t["rev_p"])}</div>
  <div class="mv-marq v-revs"><div class="mv-track mv-track--slow">{revs(False)}{revs(True)}</div></div></section>''')
    # 06 team
    slides = ''.join(f'''<div class="v-member{" is-active" if i == 0 else ""}" data-member="{i}"{"" if i == 0 else " aria-hidden=\"true\""}>
      {img(im, n, "v-member-photo")}
      <div class="v-member-txt"><blockquote class="v-quote">“{q}”</blockquote><div><p class="v-who"><strong>{n}</strong><span>{r}</span></p><p class="v-what"><em>{t['what']}</em>{''.join(f'<span>{x}</span>' for x in t['tags'][i])}</p></div></div></div>''' for i, (im, n, r, q) in enumerate(t['team']))
    tabs = ''.join(f'<button type="button" class="v-tab{" is-active" if i == 0 else ""}" data-tab="{i}" aria-pressed="{"true" if i == 0 else "false"}"><span class="bar" aria-hidden="true"><i></i></span>{img(im, "", "v-ava")}<span><strong>{n}</strong><em>{r}</em></span></button>' for i, (im, n, r, q) in enumerate(t['team']))
    links = ''.join(f'<a href="{h}"{" target=\"_blank\" rel=\"noopener\"" if h.startswith("http") else ""}>{l}</a>' for h, l in [CONTACTS[0], CONTACTS[3], CONTACTS[2]])
    o.append(f'''<section id="team" class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(6, t["team_idx"], t["team_h"])}
  <div class="v-team" data-team=""><div class="v-stage">{slides}</div><div class="v-tabs">{tabs}</div></div>
</div></section>''')
    # 07 pricing
    plans = ''
    for i, (h, d, inc, p1, p3, goal) in enumerate(t['plans']):
        rec = i == 0
        lis = ''.join(f'<li>{x}</li>' for x in inc)
        plans += (f'<div class="v-card v-plan{" is-rec" if rec else ""}" data-spot-card=""><div class="v-plan-top"><span class="v-num">0{i+1}</span>{f"<span class=\"v-badge\">{t['badge']}</span>" if rec else ""}</div>'
                  f'<h3 class="v-h3">{h}</h3><p>{d}</p><p class="v-price"><span>{t["from_"]}</span><b data-p1="{p1.replace(chr(34), "&quot;")}" data-p3="{p3.replace(chr(34), "&quot;")}">{p1}</b></p>'
                  f'<ul>{lis}</ul><a class="mv-btn{"" if rec else " mv-btn--line"}" href="#contact" data-goal="{goal}">{t["cta"]} {ARROW}</a></div>')
    note = f'<p class="v-note">{t["price_note"]}</p>' if t['price_note'] else ''
    o.append(f'''<section id="pricing" class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(7, t["price_idx"], t["price_h"], t["price_p"])}
  <div class="v-pay" role="group" aria-label="{t["pay"][0]} / {t["pay"][1]}"><button type="button" aria-pressed="true" data-pay="1">{t["pay"][0]}</button><button type="button" aria-pressed="false" data-pay="3">{t["pay"][1]}</button></div>
  <div class="v-3 v-plans">{plans}</div>{note}
</div></section>''')
    # 08 contact
    steps = ''.join(f'<li data-next="{i}"><span class="v-num">{i+1}</span>{s}</li>' for i, s in enumerate(t['next_steps']))
    chips = ''.join(f'<label class="v-chip"><input type="radio" name="goal" value="{v}"{" checked" if i == 0 else ""}><span>{l}</span></label>' for i, (v, l) in enumerate(t['goals']))
    o.append(f'''<section id="contact" class="v-sec v-rule" data-reveal=""><div class="v-wrap">{head(8, t["contact_idx"], t["contact_h"], t["contact_p"])}
  <div class="v-contact">
  <form class="v-form" data-lead-form="" data-endpoint="" novalidate="novalidate" data-err-name="{t["err_name"]}" data-err-email="{t["err_email"]}" data-err-net="{t["err_net"]}">
    <div data-form-fields="">
      <input type="hidden" name="goal" value="">
      <div class="v-fields">
        <label class="v-field"><span>{t["f_name"]}</span><input class="v-in" name="name" autocomplete="name" required="required"></label>
        <label class="v-field"><span>{t["f_email"]}</span><input class="v-in" type="email" name="email" autocomplete="email" required="required"></label>
        <label class="v-field v-field--full"><span>{t["f_phone"]}</span><input class="v-in" type="tel" name="phone" autocomplete="tel"></label>
      </div>
      <p class="mv-err" data-form-error="" hidden="hidden" role="alert"></p>
      <div class="v-submit"><button class="mv-btn" type="submit">{t["cta"]} {ARROW}</button><span class="v-host">{t["reply"]}</span></div>
    </div>
    <div class="v-done" data-form-done="" hidden="hidden"><p class="v-h3">{t["done_h"]}</p><p>{t["done_p"]}</p></div>
  </form><ol class="v-next">{steps}</ol></div>
</div></section>
</main>''')
    # footer
    fnav = ''.join(f'<a href="{h}">{n}</a>' for h, n in zip(anchors, t['nav']))
    fcon = ''.join(f'<a href="{h}"{" target=\"_blank\" rel=\"noopener\"" if h.startswith("http") else ""}>{l}</a>' for h, l in CONTACTS)
    ticks = ''.join(f'<span>{k:02d}</span>' for k in range(1, 13))
    c = t['foot_cols']
    o.append(f'''<footer class="v-foot"><div class="v-wrap">
  <div class="v-foot-top"><div><img class="v-foot-logo" src="{P}assets/img/logo-light.svg" alt="MAVPY design &amp; dev" loading="lazy"><p class="v-foot-tag">{t["foot_tag"]}</p></div>
    <nav aria-label="{t["foot_nav"]}"><p class="v-foot-h">{c[0]}</p>{fnav}</nav>
    <div><p class="v-foot-h">{c[1]}</p>{fcon}</div>
    <div><p class="v-foot-h">{c[2]}</p>{''.join(f"<span>{s}</span>" for s in t["studio"])}</div></div>
  <div class="v-ticks" aria-hidden="true">{ticks}</div>
  <p class="v-foot-word" aria-hidden="true">MAVPY</p>
  <div class="v-foot-bot"><span>{t["copy"]}</span><a href="#top">{t["top"]}</a></div>
</div></footer>
</div>''')
    return '\n'.join(o).replace('{P}', P)


def html(lang):
    t = E if lang == 'en' else U
    P = '../' if lang == 'uk' else ''
    return f'''<!doctype html>
<html lang="{t["html_lang"]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t["title"]}</title>
<meta name="description" content="{t["desc"]}">
<link rel="icon" href="{P}assets/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="{P}assets/img/apple-touch-icon.png">
<link rel="alternate" hreflang="en" href="/"><link rel="alternate" hreflang="uk" href="/ua/">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel="stylesheet">
<link rel="stylesheet" href="{P}styles.css">
<style>body{{margin:0;background:#F2F2F2}}</style>
</head>
<body>
{page(t, lang)}
<script src="{P}main.js"></script>
</body>
</html>
'''


os.makedirs(os.path.join(REPO, 'ua'), exist_ok=True)
open(os.path.join(REPO, 'index.html'), 'w', encoding='utf-8').write(html('en'))
open(os.path.join(REPO, 'ua', 'index.html'), 'w', encoding='utf-8').write(html('uk'))
print('ok')
