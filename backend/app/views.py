from django.shortcuts import render, redirect
from .models import Users
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
import random
from django.core.mail import send_mail  # Email yuborish uchun

def generate_code():
    return str(random.randint(100000, 999999))


def verify_view(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        user_id = request.session.get('user_id')
        user = Users.objects.get(id=user_id)

        if user.verification_code == code:
            user.is_active = True
            user.is_verified = True
            user.verification_code = ''
            user.save()
            messages.success(request, 'Muvaffaqiyatli tasdiqlandi!')
            return redirect('login')
        else:
            messages.error(request, 'Kod noto‘g‘ri.')
    
    return render(request, 'verification.html')


def register_view(request):
    if request.method == 'POST':
        phone = request.POST.get('telefon')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, 'Parollar mos emas.')
            return redirect('register')

        # Foydalanuvchi mavjudligini tekshirish
        if Users.objects.filter(phone_number=phone).exists() or Users.objects.filter(email=email).exists():
            messages.error(request, 'Bunday foydalanuvchi allaqachon mavjud.')
            return redirect('register')

        code = generate_code()
        user = Users.objects.create_user(
            username=email or phone,
            email=email,
            phone_number=phone,
            password=password1,
            verification_code=code,
            is_active=False  # Hali faollashtirilmagan
        )

        if email:
            send_mail(
                'Tasdiqlash kodi',
                f'Sizning tasdiqlash kodingiz: {code}',
                'noreply@mysite.com',
                [email],
                fail_silently=False,
            )

        request.session['user_id'] = user.id
        return redirect('verify')

    return render(request, 'register.html')



def index(request):
    return render(request, 'index.html')  # oddiy bosh sahifa


def login_view(request):
    if request.method == 'POST':
        login_input = request.POST.get('login')
        password = request.POST.get('password')

        try:
            # Telefon yoki email asosida foydalanuvchini topamiz
            user = Users.objects.get(phone_number=login_input) if login_input.isdigit() else Users.objects.get(email=login_input)
        except Users.DoesNotExist:
            messages.error(request, 'Foydalanuvchi topilmadi.')
            return redirect('login')

        user = authenticate(request, username=user.username, password=password)

        if user is not None:
            if not user.is_active:
                messages.error(request, 'Hisobingiz faollashtirilmagan. Avval tasdiqlang.')
                return redirect('login')

            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Parol noto‘g‘ri.')
    
    return render(request, 'login.html')




def logout_view(request):
    logout(request)
    return redirect('login')
